import {CardValidator} from "../src/validators/CardValidator";
import {ValidationError} from "../src/errors/ValidationError";
import {CardProvider} from "../src/constants/CardProvider";
import {CreditCardError} from "../src/errors/CreditCardError";


describe('CardValidator', () => {

    let validator: CardValidator;

    beforeEach(() => {
        validator = new CardValidator();
    });

    describe('addRule()', () => {
        it('should add a rule to the validator', () => {
            const rule = {func: (input:string) => input.length === 2, "message": "the value does not meet the requirements."};
            validator.addRule(rule.func);
            expect(validator['rules']).toContainEqual(rule);
        });
    });

    describe('validate()', () => {
        it('should throw an error for an invalid card number', () => {
            const cardNumber = '1234567890123456';
            expect(() => validator.validate({cardNumber})).toThrow(CreditCardError);
        });

        it('should not throw an error for a valid card number', () => {
            const cardNumber = '4532015112830366';
            expect(() => validator.validate({cardNumber})).not.toThrow();
        });

        it('should work with custom rules', () => {
            const rule = {func: (input:string) => input.length === 2, "message": "the value does not meet the requirements."};
            validator.addRule(rule.func, rule.message);
            expect(() => validator.validate({cardNumber: '42'})).not.toThrow();
            expect(validator.getErrorMessages({cardNumber: '42'})).toEqual([]);
        });

        it('should work with custom rules and push the error to erros', () => {
            const rule = {func: (input:string) => input.length === 1, "message": "the value does not meet the requirements."};
            validator.addRule(rule.func, rule.message);
            expect(() => validator.validate({cardNumber: '42'})).toThrow();
            expect(validator.getErrorMessages({cardNumber: '42'})).toEqual(["the value does not meet the requirements."]);
        });
    });

    describe('isValid', () => {
        it('should return true for a valid card number', () => {
            const cardNumber = '4532015112830366';
            expect(validator.isValid(cardNumber)).toBe(true);
        });

        it('should return false for an invalid card number', () => {
            const cardNumber = '1234567890123456';
            expect(validator.isValid(cardNumber)).toBe(false);
        });
    });

    describe('validate()', () => {
        it('should not throw an error for a valid card number', () => {
            const cardNumber = '4532015112830366';
            expect(() => validator.validate({cardNumber})).not.toThrow();
        });

        it('should throw an error for an invalid card number', () => {
            expect(() => validator.validate({cardNumber: '123'})).toThrow(CreditCardError);
        });
    });

    describe('getErrorMessages()', () => {
        it('should return an array with the error message', () => {
            const cardNumber = '4532015112830367';
            expect(validator.getErrorMessages({cardNumber, provider: CardProvider.Visa})).toEqual(["Invalid card number"]);
        });

        it('should work with a string as an input', () => {
            const cardNumber = '5500005555555559';
            expect(() => validator.getErrorMessages(cardNumber)).not.toThrow();
        });

        it('should work with a creditCard and date as an input', () => {
            const cardNumber = '5500005555555559';
            expect(validator.getErrorMessages({cardNumber, expirationDate: "12/02"})).toEqual(["Expiration validation failed"]);
        });

        it('should return an array with the error message if the provider is unknown', () => {
            const cardNumber = '4532015112830366';
            // @ts-ignore
            const arr = validator.getErrorMessages({cardNumber, provider: 'Mijitus'});

            expect(arr).toEqual(["Invalid card number for provider Mijitus"]);
        });
    });

    it('should not throw an error for a valid Visa card number', () => {
        const cardNumber = '4532015112830366';
        expect(() => validator.validate({cardNumber, provider:CardProvider.Visa})).not.toThrow();
    });

    it('should throw an error for a valid Visa card number', () => {
        const cardNumber = '1132015112830366';
        expect(() => validator.validate({cardNumber, provider:CardProvider.Visa})).toThrow(CreditCardError);
    });

    it('should not throw an error for a valid Visa card number with valid expiration date', () => {
        const cardNumber = '4532015112830366';
        expect(() => validator.validate({cardNumber, provider:CardProvider.Visa, expirationDate: '12/99'})).not.toThrow();
    });

    it('should throw an error for a valid Visa card number with valid expiration date', () => {
        const cardNumber = '4532015112830366';
        expect(() => validator.validate({cardNumber, provider:CardProvider.Visa, expirationDate: '12/02'})).toThrow(CreditCardError);
    });

    it('should throw an error for an invalid Visa card number', () => {
        const cardNumber = '4532015112830367';
        expect(() => validator.validate({cardNumber, provider: CardProvider.Visa})).toThrow(CreditCardError);
    });

    it('should not throw an error for a valid MasterCard card number', () => {
        const cardNumber = '5500005555555559';
        expect(() => validator.validate({cardNumber, provider: CardProvider.MasterCard})).not.toThrow();
    });

    it('should not throw an error for a valid MasterCard card number', () => {
        const cardNumber = '2720999999999996';
        expect(() => validator.validate({cardNumber, provider: CardProvider.MasterCard})).not.toThrow();
    });

    it('should throw an error for an invalid MasterCard card number', () => {
        const cardNumber = '5500005555555558';
        expect(() => validator.validate({cardNumber, provider: CardProvider.MasterCard})).toThrow(CreditCardError);
    });

    it('should not throw an error for a valid American Express card number', () => {
        const cardNumber = '378282246310005';
        expect(() => validator.validate({cardNumber, provider: CardProvider.AmericanExpress})).not.toThrow();
    });

    it('should throw an error for an invalid American Express card number', () => {
        const cardNumber = '378282246310006';
        expect(() => validator.validate({cardNumber, provider: CardProvider.AmericanExpress})).toThrow(CreditCardError);
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6011514433546201';
        expect(() => validator.validate({cardNumber, provider: CardProvider.Discover})).not.toThrow();
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6221265407526325';
        expect(() => validator.validate({cardNumber, provider: CardProvider.Discover})).not.toThrow();
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6444557143804342';
        expect(() => validator.validate({cardNumber, provider: CardProvider.Discover})).not.toThrow();
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6554432752066615';
        expect(() => validator.validate({cardNumber, provider: CardProvider.Discover})).not.toThrow();
    });

    it('should throw an error for an invalid Discover card number', () => {
        const cardNumber = '6011514433546202';
        expect(() => validator.validate({cardNumber, provider: CardProvider.Discover})).toThrow(CreditCardError);
    });

    it('should not throw an error for a valid card number without checking the provider', () => {
        const cardNumber = '4532015112830366';
        expect(() => validator.validate({cardNumber})).not.toThrow();
    });

    it('should throw an error for an invalid card number without checking the provider', () => {
        const cardNumber = '4532015112830367';
        expect(() => validator.validate({cardNumber})).toThrow(CreditCardError);
    });

    describe("validateExpiration", () => {
        it("should throw a ValidationError for an expired expiration date", () => {
            expect(() => CardValidator.validateExpiration("03/23")).toThrowError(
                ValidationError
            );
        });

        it("should throw a ValidationError for an invalid expiration date format", () => {
            expect(() => CardValidator.validateExpiration("0423")).toThrowError(
                ValidationError
            );
        });

        it("should throw a ValidationError for an expiration date in the past", () => {
            expect(() => CardValidator.validateExpiration("04/22")).toThrowError(
                ValidationError
            );
        });

        it("should throw a ValidationError for a month that is not a number", () => {
            expect(() => CardValidator.validateExpiration("AA/25")).toThrowError(
                ValidationError
            );
        });

        it("should throw a ValidationError for a month that is less than 1", () => {
            expect(() => CardValidator.validateExpiration("00/25")).toThrowError(
                ValidationError
            );
        });

        it("should throw a ValidationError for a month that is greater than 12", () => {
            expect(() => CardValidator.validateExpiration("13/25")).toThrowError(
                ValidationError
            );
        });

        it("should throw a ValidationError for an expired month in the current year", () => {
            expect(() => CardValidator.validateExpiration("04/22")).toThrowError(
                ValidationError
            );
        });

        it("should not throw an error for a valid expiration date", () => {
            expect(() => CardValidator.validateExpiration("04/25")).not.toThrow();
        });
    });

    describe('card providers', () => {

        let cardProvider: CardValidator;

        beforeEach(() => {
           cardProvider = new CardValidator();
        });

        test('JCB card', () => {
            expect(CardValidator.isCardProviderValid('3530111333300000', CardProvider.JCB)).toBe(true);
            expect(CardValidator.isCardProviderValid('3566002020360505', CardProvider.JCB)).toBe(true);
            expect(CardValidator.isCardProviderValid('3530111333300001', CardProvider.MasterCard)).toBe(false);
        });

        test('Diners Club card', () => {
            expect(CardValidator.isCardProviderValid('36123456789012', CardProvider.DinersClub)).toBe(true);
            expect(CardValidator.isCardProviderValid('38520000023237', CardProvider.DinersClub)).toBe(true);
            expect(CardValidator.isCardProviderValid('36123456789012', CardProvider.Visa)).toBe(false);
        });

        test('Maestro card', () => {
            expect(CardValidator.isCardProviderValid('6759649826438453', CardProvider.Maestro)).toBe(true);
            expect(CardValidator.isCardProviderValid('6799990100000000019', CardProvider.Maestro)).toBe(true);
            expect(CardValidator.isCardProviderValid('6759649826438453', CardProvider.AmericanExpress)).toBe(false);
        });

        test('UnionPay card', () => {
            expect(CardValidator.isCardProviderValid('6212345678901234', CardProvider.UnionPay)).toBe(true);
            expect(CardValidator.isCardProviderValid('6288888888888888', CardProvider.UnionPay)).toBe(true);
            expect(CardValidator.isCardProviderValid('6212345678901234', CardProvider.Discover)).toBe(false);
        });

        test('Tarjeta Naranja card', () => {
            expect(CardValidator.isCardProviderValid('5895623456781234', CardProvider.TarjetaNaranja)).toBe(true);
            expect(CardValidator.isCardProviderValid('5465531234567890', CardProvider.TarjetaNaranja)).toBe(true);
            expect(CardValidator.isCardProviderValid('5895623456781234', CardProvider.Visa)).toBe(false);
        });
    })

});