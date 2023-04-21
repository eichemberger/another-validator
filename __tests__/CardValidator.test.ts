import {CardValidator} from "../src/validators/CardValidator";
import {ValidationError} from "../src/errors/ValidationError";
import {CardProvider} from "../src/constants/CardProvider";


describe('CardValidator', () => {

    let validator: CardValidator;

    beforeEach(() => {
        validator = new CardValidator();
    })

    it('should not throw an error for a valid Visa card number', () => {
        const cardNumber = '4532015112830366';
        expect(() => validator.validate(cardNumber, CardProvider.Visa)).not.toThrow();
    });

    it('should throw an error for an invalid Visa card number', () => {
        const cardNumber = '4532015112830367';
        expect(() => validator.validate(cardNumber, CardProvider.Visa)).toThrow(ValidationError);
    });

    it('should not throw an error for a valid MasterCard card number', () => {
        const cardNumber = '5500005555555559';
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
});