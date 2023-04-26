import {ValidationError} from "../../errors/ValidationError";
import {baseMessages, commonMessages} from "../../constants/messages";

export abstract class ParentValidator {
    protected isNullableFlag = false;
    protected notNullFlag = {status: false, message: ""};

    public abstract getErrorMessages(input: any): string[];
    public abstract validate(input: any): void;

    public isValid(input: any): boolean {
        try {
            this.validate(input);
            return true;
        } catch (e) {
            return false;
        }
    }

    // configure nullability
    public isNullable() {
        this.cannotBeNull();
        this.isNullableFlag = true;
        return this;
    }

    public notNull(message?: string) {
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

    protected handlePossibleNull(input: any): string | null {
        if (this.isNullableFlag && (input === null || input === undefined)) {
            return null;
        }

        if (input === null || input === undefined) {
            if (this.notNullFlag.status) {
                return this.notNullFlag.message;
            }

            throw new ValidationError("input cannot be null or undefined", ["input cannot be null or undefined"]);
        }

        return null;
    }
}
