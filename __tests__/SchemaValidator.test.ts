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
        it('should throw if notNull is used with isNullable', () => {
            schemaValidator.notNull();
            expect(() => schemaValidator.isNullable()).toThrow(Error);
        });

        it('should throw if isNullable is used with notNullable', () => {
            schemaValidator.isNullable();
            expect(() => schemaValidator.notNull()).toThrow(Error);
        });

        it('return an empty Array if the value is null and can be nullable', () => {
            schemaValidator.isNullable();
            expect(schemaValidator.getErrorMessages(null)).toEqual([]);
        });

        it('should throw an error if a null value is passed', () => {
            schemaValidator = new SchemaValidator({name: new Validator().minLength(3), age: new NumberValidator().min(18)});
            expect(() => schemaValidator.getErrorMessages(null)).toThrow(ValidationError);
        })

        it('should throw an error if a null value is passed', () => {
            expect(() => schemaValidator.getErrors(null)).toThrow(ValidationError);
        })

        it('return an empty Array if the value is undefined and can be nullable', () => {
            schemaValidator.isNullable();
            expect(schemaValidator.getErrorMessages(undefined)).toEqual([]);
        });

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
                    "city": [
                        "the value does not meet the minimum length"
                    ],
                    "street": [
                        "the value does not meet the minimum length"
                    ]
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
            };

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
                    "city": [
                        "the value does not meet the minimum length"
                    ],
                    "street": [
                        "the value does not meet the minimum length"
                    ]
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

        it('should work if has unknown keys getErrorsMessages', () => {
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

            expect(() => nestedSchemaValidator.getErrorMessages(obj)).not.toThrowError();
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
            expect(nestedSchemaValidator.getErrorMessages(obj)).toEqual([]);
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

        it('should work with valid complex schemas', () => {
            const colorsValidator = new Validator().onlyCharacters().notEmpty();
            const productValidator = new SchemaValidator({
                price: new NumberValidator().min(0),
                sku: new Validator().fixedLength(10).onlyNumbers(),
                availableColors: new ArrayValidator(colorsValidator).notEmpty()
            });
            const productsValidator = new ArrayValidator(productValidator).notEmpty();
            const purchaseValidator = new SchemaValidator({
                products: productsValidator,
                user: new Validator().isEmail()
            });

            const obj = {
                user: 'german@mail.com',
                products: [
                    {
                        price: 10,
                        sku: '1234567890',
                        availableColors: ['red', 'blue']
                    },
                    {
                        price: 20,
                        sku: '1234567891',
                        availableColors: ['red', 'blue']
                    }
                ]
            };

            expect(() => purchaseValidator.validate(obj)).not.toThrowError();
        });

        it('should validate invalid complex schemas', () => {
            const colorsValidator = new Validator().onlyCharacters().notEmpty();
            const productValidator = new SchemaValidator({
                price: new NumberValidator().min(0),
                sku: new Validator().fixedLength(10).onlyNumbers(),
                availableColors: new ArrayValidator(colorsValidator).notEmpty()
            });
            const productsValidator = new ArrayValidator(productValidator)
                .notEmpty()
                .noDuplicates()
                .comparator((a, b) => a.sku === b.sku);
            const purchaseValidator = new SchemaValidator({
                products: productsValidator,
                user: new Validator().isEmail()
            });

            const obj = {
                user: 'mail.com',
                products: [
                    {
                        price: 10,
                        sku: '1234567890',
                        availableColors: ['red', 'blue']
                    },
                    {
                        price: 20,
                        sku: '1234567890',
                        availableColors: ['red', 'blue']
                    }
                ]
            };

            expect(() => purchaseValidator.validate(obj)).toThrowError(ValidationError);
            expect(purchaseValidator.getErrors(obj)).toEqual({
                "products": [
                    "the array must not contain any duplicates"
                ],
                "user": [
                    "the value is not a valid email"
                ]
            });
        });
    });
});