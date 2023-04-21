import {Validator} from "./Validator";
import {NumberValidator} from "./NumberValidator";
import {arrayMessages, commonMessages} from "../constants/messages";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {IValidator} from "../types/IValidator";
import {BaseValidator} from "./BaseValidator";
import {SchemaValidator} from "./SchemaValidator";

export class ArrayValidator<T> extends BaseValidator implements IValidator<T[]>{
    private comparatorFunc = (a: T, b: T) => a === b;
    private validator: Validator | NumberValidator | SchemaValidator;
    private minLengthFlag = {value: 0, message: arrayMessages.min, status: true};
    private maxLengthFlag = {value: Infinity, message: arrayMessages.max, status: true};
    private notEmptyFlag = {value: false, message: arrayMessages.notEmpty, status: true};
    private noDuplicatesFlag = {value: false, message: arrayMessages.noDuplicates, status: true};

    constructor(validator: Validator | NumberValidator | SchemaValidator) {
        super();
        this.validator = validator;
    }

    public comparator(func: (a: T, b: T) => boolean): this {
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

    private _hasDuplicates(input: T[]): boolean {
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

        if (this.minLengthFlag.status && input.length < this.minLengthFlag.value) {
            errors.push(this.minLengthFlag.message);
        }
        if (this.maxLengthFlag.status && input.length > this.maxLengthFlag.value) {
            errors.push(this.maxLengthFlag.message);
        }
        if (this.notEmptyFlag.status && input.length === 0) {
            errors.push(this.notEmptyFlag.message);
        }
        if (this.noDuplicatesFlag.status && this._hasDuplicates(input)) {
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

    assertIsValid(input: T[]): void {
        this.validate(input);
    }


}