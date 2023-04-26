import {ValidationError} from "../../errors/ValidationError";
import {messages} from "../../constants/messages";
import {CustomValidator} from "../../types/CustomValidator";
import {buildErrorMsg} from "../../utils/buildErrorMsg";
import {ParentValidator} from "./ParentValidator";

export abstract class BaseValidator<T> extends ParentValidator {
    public name: string | null;
    protected rules: CustomValidator[] = [];

    constructor(fieldName?: string) {
        super();
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
}