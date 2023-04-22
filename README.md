# Another Validator

Whether you're building a simple form or a complex application, this validator is a valuable tool for validating user input and data.

## Features

- Configurable input requirements, such as minimum length, maximum length, lowercase, uppercase, digits, and special characters, making it easy to customize the validation rules to match your specific needs.
- Extensible capabilities. You can add custom validation functions for specific use cases, allowing you to easily create validation rules that are tailored to your application's unique requirements.
- Flexible configuration options, allowing you to specify which validation rules are required and which are optional.
- Customizable error messages.

## Installation

```bash
npm install another-validator
```

## Usage

### Validators 

This package provides a set of validators that you can use to validate user input.

- `Validator` - Validates a single input, such as a password or a username.
- `NumberValidator` - Validates a number.
- `CardValidator` - Validates a credit card number (Uses Luhn's Algorithm). It can validate a number of different card types, including Visa, MasterCard, American Express and Discover.
- `SchemaValidator` - Validates an object. It can validate multiple inputs at once. You can nest SchemaValidator for complex objects and arrays.
- `ArrayValidator` - Validates that each element in an array meets the specified requirements.

### Add validations 

When you create a new validator, you can specify the validation rules that you want to use. You can also specify the error messages that you want to use for each rule. 

If you have specific requirements for your application, you can add custom validation rule. In order to do that you have to create your own validation function. The validation function should return a boolean value. If the function returns `true`, the input is considered valid. If the function returns `false`, the input is considered invalid.

Example: 
```js
const passwordValidator = new Validator()
  .minLength(5)
  .maxLength(10)
  .requireLowercase("this input requires a lowercase letter")
  .requireUppercase()
  .requireDigits()
  .requireSpecialCharacters()
  .addRule((input) => {
    return !input.includes("example");
  });

const ageValidator = new NumberValidator()
  .min(18)
  .max(65)
  .notNull("this input cannot be null");

const cardValidator = new CardValidator();

const productValidator = new SchemaValidator({
  name: new Validator().notEmpty(),
  price: new NumberValidator().min(0),
  sku: new Validator().fixedLength(10).onlyNumbers(),
});

const productsValidator = new ArrayValidator(productValidator)
  .notEmpty()
  .noDuplicates()
  .comparator((a, b) => a.sku === b.sku);

const schemaValidator = new SchemaValidator({
  username: new Validator().notEmpty(),
  password: passwordValidator, 
  age: ageValidator, 
  card: new CardValidator(), 
  products: productsValidator,
});

schemaValidator.validate(someObject);
```

## Available methods

Each validator has three common methods:

- `isValid(inpput)` - Returns `true` if the input meets the requirements, otherwise returns `false`.
- `validate(input)` - Throws an error if the input does not meet the requirements. The error object contains information about all the errors. You should use this method if you want to get detailed information about the errors.
- `assertIsValid(input)` - Also throws an error if the input does not meet the requirements. You should use this method if you don't care about the error details. The error object will only contain a message from the first error.
- `getErrorMessages(input)` - Returns an array of error messages. It does not throw an error.

`SchemaValidator` has a `getErrors(input)` method that returns an object with the error messages. The object keys are the names of the validators.

### Validator 

| Method | Description | Parameters                                                     |
|--------|-------------|----------------------------------------------------------------|
| `notEmpty` | Validates that the input is not empty. | `message?: string` (optional)                                  |
| `notBlank` | Validates that the input is not blank (contains non-whitespace characters). | `message?: string` (optional)                                  |
| `fixedLength` | Validates that the input has a fixed length. | `length: number`, `message?: string` (optional)                |
| `isEmail` | Validates that the input is a valid email. | `message?: string` (optional)                                  |
| `isUrl` | Validates that the input is a valid URL. | `message?: string` (optional)                                  |
| `minLength` | Validates that the input has a minimum length. | `length: number`, `message?: string` (optional)                |
| `maxLength` | Validates that the input has a maximum length. | `length: number`, `message?: string` (optional)                |
| `addRule` | Adds a custom validation rule. | `rule: (input: string) => boolean`, `message?: string` (optional) |
| `requireUppercase` | Validates that the input contains at least one uppercase character. | `message?: string` (optional)                                  |
| `requireLowercase` | Validates that the input contains at least one lowercase character. | `message?: string` (optional)                                  |
| `requireNumber` | Validates that the input contains at least one number. | `message?: string` (optional)                                  |
| `requireSpecialCharacter` | Validates that the input contains at least one special character. | `message?: string` (optional)                                  |
| `noWhitespaces` | Validates that the input contains no whitespace characters. | `message?: string` (optional)                                  |
| `noNumbers` | Validates that the input contains no numbers. | `message?: string` (optional)                                  |
| `noSpecialCharacters` | Validates that the input contains no special characters. | `message?: string` (optional)                                  |
| `onlyNumbers` | Validates that the input contains only numbers. | `message?: string` (optional)                                  |
| `noRepeatedCharacters` | Validates that the input contains no repeated characters. | `message?: string` (optional)                                  |
| `onlyCharacters` | Validates that the input contains only alphabetical characters. | `message?: string` (optional)                                  |

When setting a max or min these values are inclusive.

### NumberValidator

| Method | Description | Parameters                                                   |
|--------|-------------|--------------------------------------------------------------|
| `min` | Sets the minimum allowed value for the input. | `value: number`, `message?: string` (optional)               |
| `max` | Sets the maximum allowed value for the input. | `value: number`, `message?: string` (optional)               |
| `addRule` | Adds a custom validation rule. | `rule: (input: number) => boolean`, `message?: string` (optional) |

When setting a max or min these values are inclusive.

### CardValidator

| Method | Description | Parameters                                                        |
|--------|-------------|-------------------------------------------------------------------|
| `validate` | Validates the card number based on the Luhn algorithm and optionally checks if it matches the given provider. Throws a ValidationError if the card number is not valid. | `cardNumber: string`, `provider?: CardProvider` (optional)        |
| `getErrorMessages` | Returns an array of error messages for the given card number based on the Luhn algorithm and optionally checks if it matches the given provider. | `{cardNumber: string, provider?: CardProvider}`                   |
| `isValid` | Checks if the card number is valid based on the Luhn algorithm and optionally checks if it matches the given provider. | `cardNumber: string`, `provider?: CardProvider` (optional)        |
| `assertIsValid` | Validates the card number and throws a ValidationError with specific error messages if it does not pass the validation rules. | `{cardNumber: string, provider?: CardProvider}`                   |
| `validateExpiration` (static) | Validates the expiration date of a card. Throws a ValidationError if the expiration date is not valid. | `expiration: string`                                              |
| `addRule` | Adds a custom validation rule. | `rule: (input: string) => boolean`, `message?: string` (optional) |

Providers: 

- Visa
- MasterCard
- AmericanExpress
- Discover

### SchemaValidator

| Method | Description | Parameters |
|--------|-------------|------------|
| `getErrors` | Returns an object containing error messages for the input object, with keys corresponding to the fields in the schema. | `input: any` |

### ArrayValidator

| Method | Description | Parameters |
|--------|-------------|------------|
| `minLength` | Sets the minimum allowed length for the input array. | `value: number`, `message?: string` (optional) |
| `maxLength` | Sets the maximum allowed length for the input array. | `value: number`, `message?: string` (optional) |
| `notEmpty` | Requires the input array to be non-empty. | `message?: string` (optional) |
| `noDuplicates` | Requires the input array to have no duplicate elements. | `message?: string` (optional) |
| `comparator` | Sets the custom comparator function to be used for checking duplicates. | `func: (a: any, b: any) => boolean` |

If you use `noDuplicates` without setting a custom comparator function, the validator will use the `===` operator to check for duplicates.
When setting a max or min these values are inclusive.

### Common methods

These methods are available for all validators.

| Method | Description | Parameters                   |
|--------|-------------|------------------------------|
| `isNullable` | Allows the input to be nullable. | -                            |
| `notNull` | Requires the input to be non-null. | `message?: string` (optional) |
| `isValid` | Checks if the input is valid according to the validation rules. | `input: any`              |
| `getErrorMessages` | Returns an array of error messages for the input based on the validation rules. | `input: any`              |
| `validate` | Validates the input and throws a ValidationError if it does not pass the validation rules. | `input: any`                 |
| `assertIsValid` | Validates the input and throws a ValidationError with a specific error message if it does not pass a validation rule. | `input: any`|

## TypeScript Support

This library is written in TypeScript and includes type definitions.

## Contributing

Contributions are welcome! Please feel free to submit a pull request, report an issue, or suggest new features.

## License

This project is licensed under the MIT License.
