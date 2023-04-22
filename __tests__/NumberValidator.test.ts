import {NumberValidator} from "../src/validators/NumberValidator";
import {commonMessages, numberMessages} from "../src/constants/messages";

describe('NumberValidator', () => {
    let validator: NumberValidator;

    beforeEach(() => {
        validator = new NumberValidator('test');
    });

    describe('min()', () => {
        it('should set the minimum value and message', () => {
            validator.min(10, 'Value must be at least 10');
            expect(validator['minFlag'].value).toEqual(10);
            expect(validator['minFlag'].message).toEqual('Value must be at least 10');
        });

        it('should throw an error if min value is greater than max value', () => {
            validator.max(3);
            expect(() => validator.min(100)).toThrowError(numberMessages.minGreaterThanMax);
        });
    });

    describe('max()', () => {
        it('should set the maximum value and message', () => {
            validator.max(100, 'Value must be at most 100');
            expect(validator['maxFlag'].value).toEqual(100);
            expect(validator['maxFlag'].message).toEqual('Value must be at most 100');
        });

        it('should throw an error if max value is smaller than min value', () => {
            validator.min(100);
            expect(() => validator.max(10)).toThrowError(numberMessages.maxSmallerThanMin);
        });
    });

    describe('validate()', () => {
        it('should throw an InvalidInputError if validation fails', () => {
            validator.min(10).max(100);
            expect(() => validator.validate(500)).toThrowError();
        });

        it('should not throw an error if validation passes', () => {
            validator.min(10).max(100).validate(50);
            expect(() => validator.validate(50)).not.toThrow();
        });
    });

    describe('getErrorMessages()', () => {
        it('should return an error if the value is null', () => {
            validator.notNull();
            // @ts-ignore
            expect(validator.getErrorMessages(null)).toEqual([commonMessages.notNull]);
        });

        it('should return an array of error messages', () => {
            validator.min(10).max(100);
            const expectedErrors = [numberMessages.min];
            expect(validator.getErrorMessages(2)).toEqual(expectedErrors);
        });

        it('should return an empty array if no errors', () => {
            validator.min(10).max(100).validate(50);
            expect(validator.getErrorMessages(15)).toEqual([]);
        });
    });

    describe('addRule()', () => {
        it('should add a custom rule', () => {
            validator.addRule((input: number) => input > 10, 'Value must be greater than 10');
            expect(validator['rules'].length).toEqual(1);
        });

        it('should validate custom rules', () => {
            validator.addRule((input: number) => input > 10, 'Value must be greater than 10');
            expect(() => validator.validate(5)).toThrowError();
        });
    });

    describe('isValid()', () => {
        it('should return true if the value is valid', () => {
            validator.min(10).max(100);
            expect(validator.isValid(50)).toEqual(true);
        });

        it('should return false if the value is invalid', () => {
            validator.min(10).max(100);
            expect(validator.isValid(500)).toEqual(false);
        });
    });

    describe('assertIsValid()', () => {
        it('should throw an InvalidInputError if validation fails', () => {
            validator.min(10).max(100);
            expect(() => validator.assertIsValid(500)).toThrowError();
        });

        it('should not throw an error if validation passes', () => {
            validator.min(10).max(100).validate(50);
            expect(() => validator.assertIsValid(50)).not.toThrow();
        });
    });
});