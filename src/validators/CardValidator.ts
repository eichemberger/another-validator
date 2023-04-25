import {CardProvider} from "../constants/CardProvider";
import {BaseValidator} from "./BaseValidator";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {messages} from "../constants/messages";
import {ICreditCardError} from "../types/ICreditCardError";
import {CreditCardError} from "../errors/CreditCardError";
import {
    isAValidCreditCardNumber,
    isCreditCardNumberAndProviderValid,
    isExpirationDateValid
} from "../functions/creditCardValidations";

export class CardValidator extends BaseValidator<string | {cardNumber: string, provider?: CardProvider, expirationDate?: string}> {
    public static isCardProviderValid(cardNumber: string, provider: CardProvider): boolean {
        return isCreditCardNumberAndProviderValid(cardNumber, provider);
    }

    public static validateExpiration(expiration: string): void {
        if (isExpirationDateValid(expiration)) {
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

        if (!isAValidCreditCardNumber(cardNumber)) {
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

        if (!isAValidCreditCardNumber(cardNumber)) {
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
