import {CardProvider} from "../constants/CardProvider";
import {BaseValidator} from "./BaseValidator";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {messages} from "../constants/messages";
import {ICreditCardError} from "../types/ICreditCardError";
import {CreditCardError} from "../errors/CreditCardError";

export class CardValidator extends BaseValidator<string | {cardNumber: string, provider?: CardProvider, expirationDate?: string}> {
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

    public static isCardProviderValid(cardNumber: string, provider: CardProvider): boolean {
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
            case CardProvider.JCB:
                // JCB: 16 digits, starts with 3528-3589
                return cardLength === 16 && /^35(2[89]|[3-8][0-9])/.test(cardNumber);
            case CardProvider.DinersClub:
                // Diners Club: 14 digits, starts with 300-305, 36 or 38
                return cardLength === 14 && (/^3(0[0-5]|[68])/.test(cardNumber));
            case CardProvider.Maestro:
                // Maestro: 12-19 digits, starts with 50, 56-58, or 6
                return (cardLength >= 12 && cardLength <= 19) && (/^(5[06-8]|6)/.test(cardNumber));
            case CardProvider.UnionPay:
                // UnionPay: 16-19 digits, starts with 62
                return (cardLength >= 16 && cardLength <= 19) && cardNumber.startsWith("62");
            case CardProvider.TarjetaNaranja:
                // Tarjeta Naranja: 16 digits, starts with 5895 or 546553
                return cardLength === 16 && (/^5895/.test(cardNumber) || /^546553/.test(cardNumber));
            default:
                return false;
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

    public validate(input: {cardNumber: string, provider?: CardProvider, expirationDate?: string} | string): void {
        const error: ICreditCardError = {};
        let hasErrors = false;
        if (typeof input === "string") {
            input = {cardNumber: input};
        }

        const {cardNumber, provider, expirationDate} = input;

        if (!this.checkLuhn(cardNumber)) {
            error.number = "Invalid card number";
            hasErrors = true;
        }

        if (provider && !CardValidator.isCardProviderValid(cardNumber, provider)) {
            error.number = `Invalid card number for provider ${provider}`;
            hasErrors = true;
        }

        if (expirationDate) {
            try {
                CardValidator.validateExpiration(expirationDate);
            } catch (e: any) {
                error.expirationDate = e.message;
                hasErrors = true;
            }
        }

        this.rules.forEach((rule) => {
            if (!rule.func(cardNumber)) {
                if (error.messages === undefined) {
                    error.messages = [];
                }
                error.messages.push(rule.message);
                hasErrors = true;
            }
        });

        if (hasErrors) {
            throw new CreditCardError(error);
        }
    }

    public getErrorMessages(input : {cardNumber: string, provider?: CardProvider, expirationDate?: string} | string): string[] {
        if (typeof input === "string") {
            input = {cardNumber: input};
        }

        const {cardNumber, provider, expirationDate} = input;

        const errors: string[] = [];

        this.rules.forEach((rule) => {
            if (!rule.func(cardNumber)) {
                errors.push(rule.message);
            }
        });

        if (!this.checkLuhn(cardNumber)) {
            errors.push("Invalid card number");
        }

        if (provider && !CardValidator.isCardProviderValid(cardNumber, provider)) {
            errors.push(`Invalid card number for provider ${provider}`);
        }

        if (expirationDate) {
            try {
                CardValidator.validateExpiration(expirationDate);
            } catch (e: any) {
                errors.push(e.message);
            }
        }

        return errors;
    }

}
