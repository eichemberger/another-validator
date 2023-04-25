import {isCreditCardValid} from "../../src/functions/creditCardValidations";
import {CardProvider} from "../../src/constants/CardProvider";

describe("isCreditCardValid", () => {
    it("returns true for valid credit card", () => {
        expect(isCreditCardValid({
            cardNumber: "4111111111111111",
            provider: CardProvider.Visa,
            expirationDate: "12/25"
        })).toBe(true);

        expect(isCreditCardValid({
            cardNumber: "5555555555554444",
            provider: CardProvider.MasterCard,
            expirationDate: "01/24"
        })).toBe(true);

        expect(isCreditCardValid({
            cardNumber: "378282246310005",
            provider: CardProvider.AmericanExpress,
            expirationDate: "02/28"
        })).toBe(true);
    });

    it("returns false for invalid credit card", () => {
        expect(isCreditCardValid({
            cardNumber: "4111111111111111",
            provider: CardProvider.MasterCard,
            expirationDate: "12/25"
        })).toBe(false);

        expect(isCreditCardValid({
            cardNumber: "5555555555554444",
            provider: CardProvider.Visa,
            expirationDate: "01/24"
        })).toBe(false);

        expect(isCreditCardValid({
            cardNumber: "378282246310005",
            provider: CardProvider.Discover,
            expirationDate: "02/28"
        })).toBe(false);

        expect(isCreditCardValid({
            cardNumber: "4111111111111112",
            provider: CardProvider.Visa,
            expirationDate: "12/25"
        })).toBe(false);

        expect(isCreditCardValid({
            cardNumber: "4111111111111111",
            provider: CardProvider.Visa,
            expirationDate: "02/20"
        })).toBe(false);
    });
});