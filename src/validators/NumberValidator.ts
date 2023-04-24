import { BaseValidator } from "./BaseValidator";
import { numberMessages } from "../constants/messages";

export class NumberValidator extends BaseValidator<number> {
    private minFlag = {value: -Infinity, message: numberMessages.min, status: true};
    private maxFlag = {value: Infinity, message: numberMessages.max, status: true};
    private isPositiveFlag = false;
    private isNonNegativeFlag = false;
    private isNegativeFlag = false;

    constructor(name?: string) {
        super(name);
    }

    public min(value: number, message?: string): this {
        if (value > this.maxFlag.value) {
            throw new Error(numberMessages.minGreaterThanMax);
        }

        this.minFlag.value = value;
        this.rules.push({func: (input: number): boolean => input >= value, message: message || numberMessages.min});
        return this;
    }

    public max(value: number, message?: string): this {
        if (value < this.minFlag.value) {
            throw new Error(numberMessages.maxSmallerThanMin);
        }

        this.maxFlag.value = value;
        this.rules.push({func: (input: number) => input <= value, message: message || numberMessages.max});
        return this;
    }

    public isPositive(message?: string): this {
        if (this.isNegativeFlag) {
            throw new Error(numberMessages.isPositiveAndIsNegative);
        }
        this.isPositiveFlag = true;
        this.rules.push({func: (input: number) => input > 0, message: message || numberMessages.isPositive});
        return this;
    }

    public isNonNegative(message?: string): this {
        if (this.isNegativeFlag) {
            throw new Error(numberMessages.isNegativeAndNonNegative);
        }
        this.isNonNegativeFlag = true;
        this.rules.push({func: (input: number) => input >= 0, message: message || numberMessages.isNonNegative});
        return this;
    }

    public isNegative(message?: string): this {
        if (this.isPositiveFlag || this.isNonNegativeFlag) {
            throw new Error(numberMessages.isNegativeAndIsPositiveOrNonNegative);
        }
        this.isNegativeFlag = true;
        this.rules.push({func: (input: number) => input < 0, message: message || numberMessages.isNegative});
        return this;
    }

}