import {NumberValidator} from "../src/validators/NumberValidator";
import {Validator} from "../src/validators/Validator";
import {SchemaValidator} from "../src/validators/SchemaValidator";
import {messages, numberMessages} from "../src/constants/messages";
import {ArrayValidator} from "../src/validators/ArrayValidator";
import {ValidationError} from "../src/errors/ValidationError";


describe('SchemaValidator', () => {

    let schema;
    let schemaValidator: SchemaValidator;

    beforeEach(() => {
        schema = {
            name: new Validator().minLength(3),
            age: new NumberValidator().min(18)
        };
        schemaValidator = new SchemaValidator(schema);
    });

    describe('notNull and isNullable', () => {
        it('should throw an error when input is null and notNull is set', () => {
            schemaValidator.notNull();
            expect(() => schemaValidator.validate(null)).toThrow(ValidationError);
        });

        it('should not throw an error when input is null and isNullable is set', () => {
            schemaValidator.isNullable();
            expect(() => schemaValidator.validate(null)).not.toThrow();
        });

        it('should throw an error when input is undefined and notNull is set', () => {
            schemaValidator.notNull();
            expect(() => schemaValidator.validate(undefined)).toThrow(ValidationError);
        });

        it('should not throw an error when input is undefined and isNullable is set', () => {
            schemaValidator.isNullable();
            expect(() => schemaValidator.validate(undefined)).not.toThrow();
        });

        it('should not throw an error when input is null and isNullable is set', () => {
            schemaValidator.isNullable();
            expect(() => schemaValidator.validate(null)).not.toThrow();
        });

        it('should throw an error when input is undefined and notNull is set', () => {
            schemaValidator.notNull();
            expect(() => schemaValidator.validate(undefined)).toThrow(ValidationError);
        });

        it('should not throw an error when input is undefined and isNullable is set', () => {
            schemaValidator.isNullable();
            expect(() => schemaValidator.validate(undefined)).not.toThrow();
        });
    });

    describe('validate', () => {
        it('should not throw an error when input matches schema', () => {
            expect(() => schemaValidator.validate({name: 'John', age: 25})).not.toThrow();
        });

        it('should not throw an error when input does not matches schema', () => {
            expect(() => schemaValidator.validate({name: 'John', age: 13})).toThrow();
        });
    });

    describe("isValid", () => {
        it('should return true when input matches schema', () => {
            expect(schemaValidator.isValid({name: 'John', age: 25})).toBe(true);
        });

        it('should return false when input does not match schema', () => {
            expect(schemaValidator.isValid({name: 'John', age: 13})).toBe(false);
        });
    });

    describe("getErrorMessages", () => {
        it('should return an array of error messages', () => {
            const expectedErrors = [
                messages.minLength,
                numberMessages.min
            ].sort();
            expect(schemaValidator.getErrorMessages({name: 'Jo', age: 13})).toEqual(expectedErrors.sort());
        });

        it('should return an empty array when input matches schema', () => {
            expect(schemaValidator.getErrorMessages({name: 'John', age: 25})).toEqual([]);
        });

    });

    describe("getErrors", () => {
        it('should return an array of errors', () => {
            const expectedErrors = {
                "age": [
                    numberMessages.min
                ],
                "name": [
                    messages.minLength
                ]
            };

            expect(schemaValidator.getErrors({name: 'Jo', age: 13})).toEqual(expectedErrors);
        });

        it('should return an empty object when input matches schema', () => {
            expect(schemaValidator.getErrors({name: 'John', age: 25})).toEqual({});
        });

        it('should work with nested schemas', () => {
            const petValidator = new Validator().minLength(3);
            const nestedSchema = {
                name: new Validator().minLength(3),
                age: new NumberValidator().min(18),
                address: new SchemaValidator({
                    street: new Validator().minLength(3),
                    city: new Validator().minLength(3)
                }),
                pets: new ArrayValidator(petValidator).notNull()
            };
            const nestedSchemaValidator = new SchemaValidator(nestedSchema);
            const obj = {name: 'Jo', age: 13, address: {street: 'Ma', city: 'Lo'}};
            const expectedError = {
                "address": {
                    "0": "the value does not meet the minimum length",
                    "1": "the value does not meet the minimum length"
                },
                "age": [
                    "the value does not meet the minimum value"
                ],
                "name": [
                    "the value does not meet the minimum length"
                ],
                "pets": [
                    "the value cannot be null or undefined"
                ]
            }

            expect(nestedSchemaValidator.getErrors(obj)).toEqual(expectedError);
        });

        it('should work with nested schemas and isNullable', () => {
            const petValidator = new Validator().minLength(3);
            const nestedSchema = {
                name: new Validator().minLength(3),
                age: new NumberValidator().min(18),
                address: new SchemaValidator({
                    street: new Validator().minLength(3),
                    city: new Validator().minLength(3)
                }),
                pets: new ArrayValidator(petValidator).isNullable()
            };
            const nestedSchemaValidator = new SchemaValidator(nestedSchema);
            const obj = {name: 'Jo', age: 13, address: {street: 'Ma', city: 'Lo'}};
            const expectedError = {
                "address": {
                    "0": "the value does not meet the minimum length",
                    "1": "the value does not meet the minimum length"
                },
                "age": [
                    "the value does not meet the minimum value"
                ],
                "name": [
                    "the value does not meet the minimum length"
                ]
            };

            expect(nestedSchemaValidator.getErrors(obj)).toEqual(expectedError);
        });

        it('should throw an error if there is a null value', () => {
            const petValidator = new Validator().minLength(3);
            const nestedSchema = {
                name: new Validator().minLength(3),
                age: new NumberValidator().min(18),
                address: new SchemaValidator({
                    street: new Validator().minLength(3),
                    city: new Validator().minLength(3)
                }),
                pets: new ArrayValidator(petValidator)
            };
            const nestedSchemaValidator = new SchemaValidator(nestedSchema);
            const obj = {name: 'Jo', age: 13, address: {street: 'Ma', city: 'Lo'}};

            expect(() => nestedSchemaValidator.getErrors(obj)).toThrowError(ValidationError);
        });

        it('should work if has unknown keys', () => {
            const nestedSchema = {
                name: new Validator().minLength(3),
                age: new NumberValidator().min(18),
                address: new SchemaValidator({
                    street: new Validator().minLength(3),
                    city: new Validator().minLength(3)
                })
            };
            const nestedSchemaValidator = new SchemaValidator(nestedSchema);
            const obj = {name: 'John', age: 19, address: {street: 'Mat', city: 'Low'}, testing: 'test'};

            expect(() => nestedSchemaValidator.getErrors(obj)).not.toThrowError();
        });

        it('schemas should work when isNullable', () => {
            const nestedSchema = {
                name: new Validator().minLength(3),
                age: new NumberValidator().min(18),
                address: new SchemaValidator({
                    street: new Validator().minLength(3),
                    city: new Validator().minLength(3)
                }).isNullable()
            };
            const nestedSchemaValidator = new SchemaValidator(nestedSchema);
            const obj = {name: 'John', age: 19, testing: 'test'};

            expect(() => nestedSchemaValidator.getErrors(obj)).not.toThrowError();
        });

        it('schemas throw an error when notNull and value is null', () => {
            const addressValidator = new SchemaValidator({
                street: new Validator().minLength(3),
                city: new Validator().minLength(3)
            }).notNull();
            const nestedSchema = {
                name: new Validator().minLength(3),
                age: new NumberValidator().min(18),
                address: addressValidator,
            };
            const nestedSchemaValidator = new SchemaValidator(nestedSchema);
            const obj = {name: 'John', age: 19, testing: 'test'};

            expect(() => nestedSchemaValidator.validate(obj)).toThrowError(ValidationError);
        });


    });


});