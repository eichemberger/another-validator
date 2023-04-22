import {arrayMessages, commonMessages} from "../src/constants/messages";
import {Validator} from "../src/validators/Validator";
import {ArrayValidator} from "../src/validators/ArrayValidator";
import {NumberValidator} from "../src/validators/NumberValidator";
import {ValidationError} from "../src/errors/ValidationError";
import {SchemaValidator} from "../src/validators/SchemaValidator";

describe("ArrayValidator", () => {
    let validator: Validator | NumberValidator | SchemaValidator;
    let arrayValidator: ArrayValidator<any>;

    beforeEach(() => {
        validator = new Validator();
        arrayValidator = new ArrayValidator(validator);
    });

    test("should validate array of valid inputs", () => {
        const input = ["apple", "banana", "orange"];
        expect(arrayValidator.isValid(input)).toBe(true);
    });

    test("should throw ValidationError for array of invalid inputs", () => {
        const input = ["apple", "banana", "", "orange"];
        validator = new Validator().notEmpty();
        arrayValidator = new ArrayValidator(validator);
        expect(() => arrayValidator.validate(input)).toThrow(ValidationError);
    });

    test("should validate array length using minLength and maxLength", () => {
        const input = ["apple", "banana", "orange"];
        arrayValidator.minLength(2).maxLength(4);
        expect(arrayValidator.isValid(input)).toBe(true);
    });

    test("should throw error if minLength is greater than maxLength", () => {
        expect(() => arrayValidator.minLength(5).maxLength(4)).toThrow(commonMessages.maxSmallerThanMin);
    });

    test("should return an array if maxLength is not valid", () => {
        const input = ["apple", "banana", "orange"];
        arrayValidator.maxLength(2);
        expect(arrayValidator.getErrorMessages(input)).toEqual([arrayMessages.max]);
    });

    test("should throw error if maxLength is smaller than minLength", () => {
        expect(() => arrayValidator.maxLength(1).minLength(2)).toThrow(commonMessages.minGreaterThanMax);
    });

    test("should validate non-empty arrays when notEmpty is set", () => {
        const input = ["apple", "banana", "orange"];
        arrayValidator.notEmpty();
        expect(arrayValidator.isValid(input)).toBe(true);
    });

    test("should return error message for empty arrays when notEmpty is set", () => {
        const input: string[] = [];
        arrayValidator.notEmpty();
        const errors = arrayValidator.getErrorMessages(input);
        expect(errors).toContain(arrayMessages.notEmpty);
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
        expect(errors).toContain(arrayMessages.noDuplicates);
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
        expect(() => arrayValidator.assertIsValid(input)).not.toThrow(ValidationError);
    });

    test("should work with NumberValidator", () => {
        const input = [1, 2, 3, 4];
        const numberValidator = new NumberValidator();
        const arrayValidatorWithNumberValidator = new ArrayValidator(numberValidator);
        expect(arrayValidatorWithNumberValidator.isValid(input)).toBe(true);
    });

    test("should return correct error messages for invalid number inputs", () => {
        const input = [1, 2, 3, -1];
        const numberValidator = new NumberValidator().min(0);
        const arrayValidatorWithNumberValidator = new ArrayValidator(numberValidator);
        const errors = arrayValidatorWithNumberValidator.getErrorMessages(input);
        expect(errors).toContain(numberValidator.getErrorMessages(-1)[0]);
    });

    describe("validate schemas", () => {

        let schemaValidator : SchemaValidator;

        beforeEach(() => {
            let str = new Validator().notEmpty();
            let num = new NumberValidator().min(0).max(100);
            schemaValidator = new SchemaValidator({
                name: str,
                age: num
            });

            arrayValidator = new ArrayValidator(schemaValidator);
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

    })

});
