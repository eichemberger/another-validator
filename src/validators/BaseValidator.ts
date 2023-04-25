import {ValidationError} from "../errors/ValidationError";
import {baseMessages, commonMessages, messages} from "../constants/messages";
import {CustomValidator} from "../types/CustomValidator";
import {buildErrorMsg} from "../utils/buildErrorMsg";

export abstract class BaseValidator<T> {
    public name: string | null;
    protected isNullableFlag = false;
    protected notNullFlag = {status: false, message: "" };
    protected rules: CustomValidator[] = [];

    constructor(fieldName?: string) {
        this.name = fieldName || null;
    }

    public addRule(rule: (value?: any) => boolean, message?: string): BaseValidator<T> {
        const newRule = { func: rule, message: messages.customRuleMessage };
        if (message !== null && message !== undefined) {
            newRule.message = message;
        }
        this.rules.push(newRule);
        return this;
    }

    public getIsNullable(): boolean {
        return this.isNullableFlag;
    }

    public isValid(input: any): boolean {
        try {
            this.validate(input);
            return true;
        } catch (e) {
            return false;
        }
    }

    public validate(input: any): void {
        const errors = this.getErrorMessages(input);

        if (errors.length > 0) {
            throw new ValidationError(buildErrorMsg(this.name), errors);
        }
    }

    public getErrorMessages(input: T | T[]): string[] {
        const nullError = this.handlePossibleNull(input);
        if (nullError !== null) {
            return [nullError];
        }

        const errors: string[] = [];

        this.rules.forEach((rule) => {
            if (!rule.func(input)) {
                errors.push(rule.message);
            }
        });

        return errors;
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