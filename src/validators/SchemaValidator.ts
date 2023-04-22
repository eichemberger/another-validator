import {BaseValidator} from "./BaseValidator";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {IValidator} from "../types/IValidator";
import {baseMessages, commonMessages} from "../constants/messages";

interface Schema {
    [key: string]: BaseValidator | SchemaValidator;
}

export class SchemaValidator implements IValidator<any> {
    private readonly schema: Schema;
    private readonly name: string | null = null;
    private isNullableFlag = false;
    private notNullFlag = {status: false, message: "" };

    constructor(schema: any, name?: string) {
        this.schema = schema;
        this.name = name || null;
    }

    public isNullable(): this {
        if (this.notNullFlag.status) {
            throw new Error(baseMessages.isNullableAndNotNull);
        }
        this.isNullableFlag = true;
        return this;
    }

    public notNull(message?: string): this {
        if (this.isNullableFlag) {
            throw new Error(baseMessages.isNullableAndNotNull);
        }
        this.notNullFlag.status = true;
        this.notNullFlag.message = message || commonMessages.notNull;
        return this;
    }

    public validate(input: any): void {
        const errors = this.getErrors(input);

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(buildErrorMsg(this.name), errors);
        }
    }

    public getErrorMessages(input: any): string[] {
        const errorMessages: string[] = [];

        if (this.isNullableFlag && (input === null || input === undefined)) {
            return errorMessages;
        }
        if (input === null || input === undefined) {
            if (this.notNullFlag.status) {
                errorMessages.push(this.notNullFlag.message);
                return errorMessages;
            }

            throw new ValidationError("input cannot be null or undefined", ["input cannot be null or undefined"]);
        }

        for (const key in this.schema) {
            const validatorOrSchema = this.schema[key];
            const inputValue = input[key];

            if (inputValue !== undefined || !this.isNullableFlag) {
                let inputErrors: string[] = [];

                if (validatorOrSchema instanceof BaseValidator) {
                    inputErrors = validatorOrSchema.getErrorMessages(inputValue);
                } else if (validatorOrSchema instanceof SchemaValidator) {
                    const nestedErrors = validatorOrSchema.getErrorMessages(inputValue);
                    errorMessages.push(...nestedErrors);
                    continue;
                }

                if (inputErrors.length > 0) {
                    errorMessages.push(...inputErrors);
                }
            }
        }

        return errorMessages;
    }

    public getErrors(input: any): { [key: string]: any } {
        const errorMessages: { [key: string]: any } = {};

        if (input == null) {
            if (this.isNullableFlag) {
                return errorMessages;
            }
            if (this.notNullFlag.status) {
                errorMessages["input"] = this.notNullFlag.message;
                return errorMessages;
            }
            throw new ValidationError("input cannot be null or undefined", ["input cannot be null or undefined"]);
        }

        for (const key in this.schema) {
            const validatorOrSchema = this.schema[key];
            const inputValue = input[key];
            const fieldName = key;

            if (!input.hasOwnProperty(key) && this.schema[key] instanceof SchemaValidator) {
                const validator = this.schema[key] as SchemaValidator;
                if (!validator.isNullableFlag) {
                    errorMessages[fieldName] = validator.getErrorMessages(inputValue);
                }
                continue;
            }

            if (!input.hasOwnProperty(key) && this.schema[key] instanceof BaseValidator) {
                const validator = this.schema[key] as BaseValidator;
                if (!validator.getIsNullable()) {
                    errorMessages[fieldName] = validator.getErrorMessages(inputValue);
                }
                continue;
            }

            if (inputValue !== undefined) {
                let inputErrors: any[] = [];

                if (validatorOrSchema instanceof BaseValidator) {
                    inputErrors = validatorOrSchema.getErrorMessages(inputValue);
                } else if (validatorOrSchema instanceof SchemaValidator) {
                    const nestedKeys = validatorOrSchema.getErrorMessages(inputValue);

                    if (nestedKeys) {
                        errorMessages[fieldName] = {...nestedKeys};
                    }
                    continue;
                }

                if (inputErrors.length > 0) {
                    errorMessages[fieldName] = inputErrors;
                }
            }
        }

        return errorMessages;
    }

    assertIsValid(input: any): void {
        const errors = this.getErrors(input);

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(buildErrorMsg(this.name), errors);
        }
    }

    isValid(input: any): boolean {
        return this.getErrorMessages(input).length === 0;
    }
}