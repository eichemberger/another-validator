import {CardProvider} from "../constants/CardProvider";
import {BaseValidator} from "./BaseValidator";
import {IValidator} from "../types/IValidator";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {CustomValidator} from "../types/CustomValidator";
import {messages} from "../constants/messages";

export class CardValidator extends BaseValidator implements IValidator<string|{cardNumber: string, provider?: CardProvider}> {
    private rules: CustomValidator<string>[] = [];

    private checkLuhn(cardNumber: string): boolean {
        let sum = 0;
        let isEvenPosition = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);

            if (isEvenPosition) {
                digit *= 2;

                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEvenPosition = !isEvenPosition;
        }

        return sum % 10 === 0;
    }

    public addRule(rule: (input: string) => boolean, message?: string): this {
        const newRule = { func: rule, message: messages.customRuleMessage };
        if (message !== null && message !== undefined) {
            newRule.message = message;
        }
        this.rules.push(newRule);
        return this;
    }

    private checkCardProvider(cardNumber: string, provider: CardProvider): boolean {
        const cardLength = cardNumber.length;

        switch (provider) {
            case CardProvider.Visa:
                // Visa: 13 or 16 digits, starts with 4
                return (cardLength === 13 || cardLength === 16) && cardNumber.startsWith("4");
            case CardProvider.MasterCard:
                // MasterCard: 16 digits, starts with 51-55 or 2221-2720
                return cardLength === 16 && (/^5[1-5]/.test(cardNumber) || /^2[2-7]/.test(cardNumber));
            case CardProvider.AmericanExpress:
                // American Express: 15 digits, starts with 34 or 37
                return cardLength === 15 && /^3[47]/.test(cardNumber);
            case CardProvider.Discover:
                // Discover: 16 digits, starts with 6011, 622126-622925, 644-649 or 65
                return cardLength === 16 && (/^6011/.test(cardNumber) || /^622(1[2-9]{2}|[2-8][0-9]{2}|9[0-2][0-5])/.test(cardNumber) || /^64[4-9]/.test(cardNumber) || /^65/.test(cardNumber));
            default:
                return false;
        }
    }

    public validate(cardNumber: string, provider?: CardProvider): void {
        const errors = this.getErrorMessages({cardNumber, provider});

        if (errors.length > 0) {
            throw new ValidationError(buildErrorMsg("Credit-Card"), errors);
        }
    }

    public getErrorMessages({cardNumber, provider} : {cardNumber: string, provider?: CardProvider}): string[] {
        const errors: string[] = [];

        if (!this.checkLuhn(cardNumber)) {
            errors.push("Invalid card number");
        }

        if (provider && !this.checkCardProvider(cardNumber, provider)) {
            errors.push(`Invalid card number for provider ${provider}`);
        }

        this.rules.forEach((rule) => {
            if (!rule.func(cardNumber)) {
                errors.push(rule.message);
            }
        });

        return errors;
    }

    public isValid(cardNumber: string, provider?: CardProvider): boolean {
        return this.getErrorMessages({cardNumber, provider}).length === 0;
    }

    public assertIsValid({cardNumber, provider} : {cardNumber: string, provider?: CardProvider}): void {
        if (!this.isValid(cardNumber, provider)) {
            throw new ValidationError(buildErrorMsg("Credit-Card"), ["Invalid card"]);
        }
    }

    public static validateExpiration(expiration: string): void {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expirationParts = expiration.split("/");
        const expirationMonth = parseInt(expirationParts[0], 10);
        const expirationYear = parseInt(expirationParts[1], 10);

        if (
            isNaN(expirationMonth) ||
            isNaN(expirationYear) ||
            expirationMonth < 1 ||
            expirationMonth > 12 ||
            expirationYear < currentYear ||
            (expirationYear === currentYear && expirationMonth < currentMonth)
        ) {
            throw new ValidationError(buildErrorMsg("Expiration"), ["Invalid expiration date"]);
        }
    }
}
