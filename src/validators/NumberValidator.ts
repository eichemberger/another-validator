import {BaseValidator} from "./BaseValidator";
import {IValidator} from "../types/IValidator";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {messages, numberMessages} from "../constants/messages";
import {CustomValidator} from "../types/CustomValidator";

export class NumberValidator extends BaseValidator implements IValidator<number> {
    private minFlag = {value: -Infinity, message: numberMessages.min, status: true};
    private maxFlag = {value: Infinity, message: numberMessages.max, status: true};
    private rules: CustomValidator<number>[] = [];

    constructor(name?: string) {
        super(name);
    }

    public min(value: number, message?: string): this {
        if (value > this.maxFlag.value) {
            throw new Error(numberMessages.minGreaterThanMax);
        }
        this.minFlag.value = value;
        this.minFlag.message = message || numberMessages.min;
        return this;
    }

    public max(value: number, message?: string): this {
        if (value < this.minFlag.value) {
            throw new Error(numberMessages.maxSmallerThanMin);
        }
        this.maxFlag.value = value;
        this.maxFlag.message = message || numberMessages.max;
        return this;
    }

    public addRule(rule: (input: number) => boolean, message?: string): this {
        const newRule = { func: rule, message: messages.customRuleMessage };
        if (message !== null && message !== undefined) {
            newRule.message = message;
        }
        this.rules.push(newRule);
        return this;
    }

    public isValid(input: number): boolean {
        return this.getErrorMessages(input).length === 0;
    }

    public validate(input: number): void {
        const errors: string[] = this.getErrorMessages(input);

        if (errors.length > 0) {
            throw new ValidationError(buildErrorMsg(this.name), errors);
        }
    }

    public getErrorMessages(input: number): string[] {
        const nullError = this.handlePossibleNull(input);
        if (nullError.length > 0) {
            return nullError;
        }

        const errors: string[] = [];

        if (this.minFlag.status && input <= this.minFlag.value) {
            errors.push(this.minFlag.message);
        }
        if (this.maxFlag.status && input >= this.maxFlag.value) {
            errors.push(this.maxFlag.message);
        }

        this.rules.forEach((rule) => {
            if (!rule.func(input)) {
                errors.push(rule.message);
            }
        });

        return errors;
    }

    public assertIsValid(input: number) {
        this.validate(input);
    }

}