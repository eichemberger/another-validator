import {ValidationError} from "../errors/ValidationError";
import {baseMessages, commonMessages} from "../constants/messages";

export class BaseValidator {
    public name: string | null;
    protected isNullableFlag = false;
    protected notNullFlag = {status: false, message: '' };

    constructor(fieldName?: string) {
        this.name = fieldName || null;
    }

    public isNullable(): this {
        this.cannotBeNull();
        this.isNullableFlag = true;
        return this;
    }

    public notNull(message?: string): this {
        this.canBeNullable();
        this.notNullFlag.status = true;
        this.notNullFlag.message = message || commonMessages.notNull;

        return this;
    }

    private canBeNullable() {
        if (this.isNullableFlag) {
            throw new Error(baseMessages.isNullableAndNotNull);
        }
    }

    private cannotBeNull() {
        if (this.notNullFlag.status) {
            throw new Error(baseMessages.isNullableAndNotNull);
        }
    }

    protected handlePossibleNull(input: any): string[] {
        const errors: string[] = [];

        if (this.isNullableFlag && (input === null || input === undefined)) {
            return errors;
        }

        if (input === null || input === undefined) {
            if (this.notNullFlag.status) {
                errors.push(this.notNullFlag.message);
                return errors;
            }

            throw new ValidationError("input cannot be null or undefined", ["input cannot be null or undefined"]);
        }

        return errors;
    }
}