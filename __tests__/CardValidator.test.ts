import {CardValidator} from "../src/validators/CardValidator";
import {ValidationError} from "../src/errors/ValidationError";
import {CardProvider} from "../src/constants/CardProvider";


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
            expect(() => validator.validate(cardNumber)).toThrow(ValidationError);
        });

        it('should not throw an error for a valid card number', () => {
            const cardNumber = '4532015112830366';
            expect(() => validator.validate(cardNumber)).not.toThrow();
        });

        it('should work with custom rules', () => {
            const rule = {func: (input:string) => input.length === 2, "message": "the value does not meet the requirements."};
            validator.addRule(rule.func, rule.message);
            expect(() => validator.validate('42')).not.toThrow();
            expect(validator.getErrorMessages({cardNumber: '42'})).toEqual([]);
        });

        it('should work with custom rules and push the error to erros', () => {
            const rule = {func: (input:string) => input.length === 1, "message": "the value does not meet the requirements."};
            validator.addRule(rule.func, rule.message);
            expect(() => validator.validate('42')).toThrow();
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
            expect(() => validator.validate(cardNumber)).not.toThrow();
        });

        it('should throw an error for an invalid card number', () => {
            expect(() => validator.validate('123')).toThrow(ValidationError);
        });
    });

    it('should not throw an error for a valid Visa card number', () => {
        const cardNumber = '4532015112830366';
        expect(() => validator.validate(cardNumber, CardProvider.Visa)).not.toThrow();
    });

    it('should throw an error for an invalid Visa card number', () => {
        const cardNumber = '4532015112830367';
        expect(() => validator.validate(cardNumber, CardProvider.Visa)).toThrow(ValidationError);
    });

    it('should return an array with the error message', () => {
        const cardNumber = '4532015112830367';
        expect(validator.getErrorMessages({cardNumber, provider: CardProvider.Visa})).toEqual(["Invalid card number"]);
    });

    it('should return an array with the error message if the provider is unknown', () => {
        const cardNumber = '4532015112830366';
        // @ts-ignore
        const arr = validator.getErrorMessages({cardNumber, provider: 'Mijitus'});

        expect(arr).toEqual(["Invalid card number for provider Mijitus"]);
    });

    it('should not throw an error for a valid MasterCard card number', () => {
        const cardNumber = '5500005555555559';
        expect(() => validator.validate(cardNumber, CardProvider.MasterCard)).not.toThrow();
    });

    it('should work with a string as an input', () => {
        const cardNumber = '5500005555555559';
        // @ts-ignore
        expect(() => validator.getErrorMessages(cardNumber)).not.toThrow();
    });

    it('should not throw an error for a valid MasterCard card number', () => {
        const cardNumber = '2720999999999996';
        expect(() => validator.validate(cardNumber, CardProvider.MasterCard)).not.toThrow();
    });

    it('should throw an error for an invalid MasterCard card number', () => {
        const cardNumber = '5500005555555558';
        expect(() => validator.validate(cardNumber, CardProvider.MasterCard)).toThrow(ValidationError);
    });

    it('should not throw an error for a valid American Express card number', () => {
        const cardNumber = '378282246310005';
        expect(() => validator.validate(cardNumber, CardProvider.AmericanExpress)).not.toThrow();
    });

    it('should throw an error for an invalid American Express card number', () => {
        const cardNumber = '378282246310006';
        expect(() => validator.validate(cardNumber, CardProvider.AmericanExpress)).toThrow(ValidationError);
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6011514433546201';
        expect(() => validator.validate(cardNumber, CardProvider.Discover)).not.toThrow();
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6221265407526325';
        expect(() => validator.validate(cardNumber, CardProvider.Discover)).not.toThrow();
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6444557143804342';
        expect(() => validator.validate(cardNumber, CardProvider.Discover)).not.toThrow();
    });

    it('should not throw an error for a valid Discover card number', () => {
        const cardNumber = '6554432752066615';
        expect(() => validator.validate(cardNumber, CardProvider.Discover)).not.toThrow();
    });

    it('should throw an error for an invalid Discover card number', () => {
        const cardNumber = '6011514433546202';
        expect(() => validator.validate(cardNumber, CardProvider.Discover)).toThrow(ValidationError);
    });

    it('should not throw an error for a valid card number without checking the provider', () => {
        const cardNumber = '4532015112830366';
        expect(() => validator.validate(cardNumber)).not.toThrow();
    });

    it('should throw an error for an invalid card number without checking the provider', () => {
        const cardNumber = '4532015112830367';
        expect(() => validator.validate(cardNumber)).toThrow(ValidationError);
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

});