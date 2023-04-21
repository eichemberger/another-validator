"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../src/constants/messages");
const Validator_1 = require("../src/validators/Validator");
const ArrayValidator_1 = require("../src/validators/ArrayValidator");
const NumberValidator_1 = require("../src/validators/NumberValidator");
const ValidationError_1 = require("../src/errors/ValidationError");
const SchemaValidator_1 = require("../src/validators/SchemaValidator");
describe("ArrayValidator", () => {
    let validator;
    let arrayValidator;
    beforeEach(() => {
        validator = new Validator_1.Validator();
        arrayValidator = new ArrayValidator_1.ArrayValidator(validator);
    });
    test("should validate array of valid inputs", () => {
        const input = ["apple", "banana", "orange"];
        expect(arrayValidator.isValid(input)).toBe(true);
    });
    test("should throw ValidationError for array of invalid inputs", () => {
        const input = ["apple", "banana", "", "orange"];
        validator = new Validator_1.Validator().notEmpty();
        arrayValidator = new ArrayValidator_1.ArrayValidator(validator);
        expect(() => arrayValidator.validate(input)).toThrow(ValidationError_1.ValidationError);
    });
    test("should validate array length using minLength and maxLength", () => {
        const input = ["apple", "banana", "orange"];
        arrayValidator.minLength(2).maxLength(4);
        expect(arrayValidator.isValid(input)).toBe(true);
    });
    test("should throw error if minLength is greater than maxLength", () => {
        expect(() => arrayValidator.minLength(5).maxLength(4)).toThrow(messages_1.commonMessages.maxSmallerThanMin);
    });
    test("should throw error if maxLength is smaller than minLength", () => {
        expect(() => arrayValidator.maxLength(1).minLength(2)).toThrow(messages_1.commonMessages.minGreaterThanMax);
    });
    test("should validate non-empty arrays when notEmpty is set", () => {
        const input = ["apple", "banana", "orange"];
        arrayValidator.notEmpty();
        expect(arrayValidator.isValid(input)).toBe(true);
    });
    test("should return error message for empty arrays when notEmpty is set", () => {
        const input = [];
        arrayValidator.notEmpty();
        const errors = arrayValidator.getErrorMessages(input);
        expect(errors).toContain(messages_1.arrayMessages.notEmpty);
    });
    test("should validate arrays without duplicates when noDuplicates is set", () => {
        const input = ["apple", "banana", "orange"];
        arrayValidator.noDuplicates();
        expect(arrayValidator.isValid(input)).toBe(true);
    });
    test("should return error message for arrays with duplicates when noDuplicates is set", () => {
        const input = ["apple", "banana", "apple", "orange"];
        arrayValidator.noDuplicates();
        const errors = arrayValidator.getErrorMessages(input);
        expect(errors).toContain(messages_1.arrayMessages.noDuplicates);
    });
    test("should validate arrays with custom comparator function", () => {
        const input = [
            { id: 1, value: "apple" },
            { id: 2, value: "banana" },
            { id: 3, value: "orange" },
        ];
        arrayValidator
            .comparator((a, b) => a.id === b.id)
            .noDuplicates();
        expect(arrayValidator.isValid(input)).toBe(true);
    });
    test("should not throw ValidationError when using assertIsValid for valid input", () => {
        const input = ["apple", "banana", "orange"];
        expect(() => arrayValidator.assertIsValid(input)).not.toThrow(ValidationError_1.ValidationError);
    });
    test("should work with NumberValidator", () => {
        const input = [1, 2, 3, 4];
        const numberValidator = new NumberValidator_1.NumberValidator();
        const arrayValidatorWithNumberValidator = new ArrayValidator_1.ArrayValidator(numberValidator);
        expect(arrayValidatorWithNumberValidator.isValid(input)).toBe(true);
    });
    test("should return correct error messages for invalid number inputs", () => {
        const input = [1, 2, 3, -1];
        const numberValidator = new NumberValidator_1.NumberValidator().min(0);
        const arrayValidatorWithNumberValidator = new ArrayValidator_1.ArrayValidator(numberValidator);
        const errors = arrayValidatorWithNumberValidator.getErrorMessages(input);
        expect(errors).toContain(numberValidator.getErrorMessages(-1)[0]);
    });
    describe("validate schemas", () => {
        let schemaValidator;
        beforeEach(() => {
            let str = new Validator_1.Validator().notEmpty();
            let num = new NumberValidator_1.NumberValidator().min(0).max(100);
            schemaValidator = new SchemaValidator_1.SchemaValidator({
                name: str,
                age: num
            });
            arrayValidator = new ArrayValidator_1.ArrayValidator(schemaValidator);
        });
        test("should validate array of valid inputs", () => {
            const input = [{
                    name: "John",
                    age: 20
                }, {
                    name: "Jane",
                    age: 30
                }, {
                    name: "Jack",
                    age: 40
                }];
            expect(arrayValidator.isValid(input)).toBe(true);
        });
        test("should throw ValidationError for array of invalid inputs", () => {
            const input = [{
                    name: "John",
                    age: 20
                }, {
                    name: "Jane",
                    age: 300
                }, {
                    name: "Jack",
                    age: -1
                }];
            expect(() => arrayValidator.validate(input)).toThrowError();
        });
    });
});
