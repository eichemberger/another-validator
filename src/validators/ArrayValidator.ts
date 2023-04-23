import {Validator} from "./Validator";
import {NumberValidator} from "./NumberValidator";
import {arrayMessages, commonMessages} from "../constants/messages";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {IValidator} from "../types/IValidator";
import {BaseValidator} from "./BaseValidator";
import {SchemaValidator} from "./SchemaValidator";

export class ArrayValidator<T> extends BaseValidator implements IValidator<T[]>{
    private comparatorFunc = (a: any, b: any) => a === b;
    private validator: Validator | NumberValidator | SchemaValidator | ArrayValidator<any>;
    private minLengthFlag = {value: 0, message: arrayMessages.min, status: true};
    private maxLengthFlag = {value: Infinity, message: arrayMessages.max, status: true};
    private notEmptyFlag = {value: false, message: arrayMessages.notEmpty, status: true};
    private noDuplicatesFlag = {value: false, message: arrayMessages.noDuplicates, status: true};

    constructor(validator: Validator | NumberValidator | SchemaValidator | ArrayValidator<any>) {
        super();
        this.validator = validator;
    }

    public comparator(func: (a: any, b: any) => boolean): this {
        this.comparatorFunc = func;
        return this;
    }

    public minLength(value: number, message?: string): this {
        if (this.maxLengthFlag.value && value > this.maxLengthFlag.value) {
            throw new Error(commonMessages.minGreaterThanMax);
        }
        this.minLengthFlag.value = value;
        this.minLengthFlag.message = message || arrayMessages.min;
        return this;
    }

    public maxLength(value: number, message?: string): this {
        if (this.minLengthFlag.value && value < this.minLengthFlag.value) {
            throw new Error(commonMessages.maxSmallerThanMin);
        }
        this.maxLengthFlag.value = value;
        this.maxLengthFlag.message = message || arrayMessages.max;
        return this;
    }

    public notEmpty(message?: string): this {
        this.notEmptyFlag.value = true;
        this.notEmptyFlag.message = message || arrayMessages.notEmpty;
        return this;
    }

    public noDuplicates(message?: string): this {
        this.noDuplicatesFlag.value = true;
        this.noDuplicatesFlag.message = message || arrayMessages.noDuplicates;
        return this;
    }

    public isValid(input: T[]): boolean {
        return this.getErrorMessages(input).length === 0;
    }

    public validate(input: T[]): void {
        const errors: string[] = this.getErrorMessages(input);

        if (errors.length > 0) {
            throw new ValidationError(buildErrorMsg(this.name), errors);
        }
    }

    private hasDuplicates(input: T[]): boolean {
        for (let i = 0; i < input.length; i++) {
            for (let j = i + 1; j < input.length; j++) {
                if (this.comparatorFunc(input[i], input[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    public getErrorMessages(input: T[]): string[] {
        const nullError = this.handlePossibleNull(input);
        if (nullError.length > 0) {
            return nullError;
        }

        const errors: string[] = [];

        if (this.minLengthFlag.status && input.length <= this.minLengthFlag.value) {
            errors.push(this.minLengthFlag.message);
        }
        if (this.maxLengthFlag.status && input.length >= this.maxLengthFlag.value) {
            errors.push(this.maxLengthFlag.message);
        }
        if (this.notEmptyFlag.status && input.length === 0) {
            errors.push(this.notEmptyFlag.message);
        }
        if (this.noDuplicatesFlag.status && this.hasDuplicates(input)) {
            errors.push(this.noDuplicatesFlag.message);
        }

        for (let i = 0; i < input.length; i++) {
            // @ts-ignore
            errors.push(...this.validator.getErrorMessages(input[i]));
        }

        const uniqueArray: string[] = [];

        for (let i = 0; i < errors.length; i++) {
            if (!uniqueArray.includes(errors[i])) {
                uniqueArray.push(errors[i]);
            }
        }

        return uniqueArray;
    }

    public getErrors(input: T[]): {[key: string]: any} {
        const errorsResponse: {[key: string]: any} = [];

        if (this.isNullableFlag && (input === null || input === undefined)) {
            return errorsResponse;
        }

        const possibleNullErrors = this.handleNullOrUndefined(input);
        if (possibleNullErrors.length > 0) {
            errorsResponse.push(possibleNullErrors);
            return errorsResponse;
        }

        if (this.validator instanceof SchemaValidator) {
            for (let i = 0; i < input.length; i++) {
                // @ts-ignore
                const error = this.validator.getErrors(input[i]);
                if (Object.keys(error).length > 0) {
                    errorsResponse.push({data: input[i], errors: error});
                }
            }
            return errorsResponse;
        }

        if (this.validator instanceof ArrayValidator) {
            for (let i = 0; i < input.length; i++) {
                const possibleNullErrors = this.handleNullOrUndefined(input[i]);
                if (possibleNullErrors.length > 0) {
                    errorsResponse.push(possibleNullErrors);
                    return errorsResponse;
                }

                // @ts-ignore
                if (this.validator.notEmptyFlag.status && input[i].length === 0) {
                    errorsResponse.push({data: input[i], errors: [this.validator.notEmptyFlag.message]});
                    continue;
                }

                // @ts-ignore
                const error = this.validator.getErrors(input[i]);
                if (error.length > 0) {
                    errorsResponse.push({data: input[i], errors: error});
                }
            }
            return errorsResponse;
        }

        for (let i = 0; i < input.length; i++) {
            const inputValue = input[i];

            const possibleNullErrors = this.handleNullOrUndefined(inputValue);
            if (possibleNullErrors.length > 0) {
                errorsResponse.push(possibleNullErrors);
                continue;
            }

            const error: {[key: string]: any}  = {};
            // @ts-ignore
            const errorMessages = this.validator.getErrorMessages(input[i]);
            if (errorMessages.length > 0) {
                const stringKey: string = this.stringify(inputValue);
                error[stringKey] = errorMessages;

                errorsResponse.push(error);
            }

        }

        return errorsResponse;
    }

    private stringify(input: any): string {
        return input.toString();
    }

    public assertIsValid(input: T[]): void {
        this.validate(input);
    }

    private handleNullOrUndefined(input: any): {[key: string]: any}[] {
        const response: {[key: string]: any}[] = [];
        if (this.notNullFlag.status && (input === null || input === undefined)) {
            response.push({'notNull': [commonMessages.notNull]});
        } else if (input === null || input === undefined) {
            throw new Error(commonMessages.notNull);
        }

        return response;
    }


}