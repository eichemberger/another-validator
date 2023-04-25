# Another Validator [![npm version](https://badge.fury.io/js/another-validator.svg)](https://badge.fury.io/js/another-validator) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Coverage Status](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://badge.fury.io/js/another-validator)

Whether you're building a simple form or a complex application, this validator is a valuable tool for validating user input and data.

## Features

- Configurable input requirements, such as minimum length, maximum length, lowercase, uppercase, digits, and special characters, making it easy to customize the validation rules to match your specific needs.
- Extensible capabilities. You can add custom validation functions for specific use cases, allowing you to easily create validation rules that are tailored to your application's unique requirements.
- Flexible configuration options, allowing you to specify which validation rules are required and which are optional.
- Customizable error messages.

## Usage

### Validators 

This package provides a set of validators that you can use to validate user input.

- `Validator` - Validates a single input, such as a password or a username.
- `NumberValidator` - Validates a number.
- `CardValidator` - Validates a credit card number (Uses Luhn's Algorithm). It can validate a number of different card types, including Visa, MasterCard, American Express, Discover, etc.
- `SchemaValidator` - Validates an object. It can validate multiple inputs at once. You can nest SchemaValidator for complex objects and arrays.
- `ArrayValidator` - Validates that each element in an array meets the specified requirements.

### Functions

If you only need to validate a simple condition, for example if the string is a mail or an url you can use a simple function. This package provides a set of functions that you can use to validate input.
Go to the [functions documentation](#functions) for more information.

### Add validations 

When you create a new validator, you can specify the validation rules that you want to use. You can also specify the error messages that you want to use for each rule. 

If you have specific requirements for your application, you can add custom validation rule. In order to do that you have to create your own validation function. The validation function should return a boolean value. If the function returns `true`, the input is considered valid. If the function returns `false`, the input is considered invalid.

Example: 
```js
// If no error messages are provided, the default error messages are used
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
- `validate(input)` - Throws an error if the input does not meet the requirements. The error object contains information about all the errors.
- `getErrorMessages(input)` - Returns an array of error messages. It does not throw an error.

`SchemaValidator` and `ArrayValidator` have a `getErrors(input)` method that returns an object with the error messages.

You should use `getErrors` if you want to get detailed information about the errors.

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

| Method | Description                                                  | Parameters                                                   |
|--------|--------------------------------------------------------------|--------------------------------------------------------------|
| `min` | Sets the minimum allowed value for the input.                | `value: number`, `message?: string` (optional)               |
| `max` | Sets the maximum allowed value for the input.                | `value: number`, `message?: string` (optional)               |
| `addRule` | Adds a custom validation rule.                               | `rule: (input: number) => boolean`, `message?: string` (optional) |
| `isNegative` | Checks if the input is negative                              | `message?: string` |
| `isPositive` | Checks if the input is positive (bigger than 0)              | `message?: string` |
| `isNonNegative` | Checks if the input is non-negative (i.e., zero or positive) | `message?: string` |

When setting a max or min these values are inclusive.

### CardValidator

If it is used with SchemaValidator it will only validate the card number.

| Method                 | Description                                                                                                                    | Parameters                                                                                                             |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| addRule                | Adds a custom rule to the list of rules                                                                                        | rule: (input: string) => boolean, message?: string                                                                     |
| isCardProviderValid    | Checks if the card number is valid for the given card provider                                                                 | cardNumber: string, provider: CardProvider                                                                             |
| validateExpiration     | Validates the expiration date of a credit card                                                                                 | expiration: string                                                                                                      |
| validate               | Validates the credit card input based on the card number, provider, and expiration date. The date must have the format (MM/YY) | input: {cardNumber: string, provider?: CardProvider, expirationDate?: string} \| string                                |
| getErrorMessages       | Returns an array of error messages based on the card number, provider, and expiration date                                     | input: {cardNumber: string, provider?: CardProvider, expirationDate?: string} \| string                                |

If you are using TypeScript, you must use the `CardProvider` enum to specify the card provider

Providers: 

- Visa
- MasterCard
- AmericanExpress
- Discover
- JBC
- DinersClub
- Maestro
- UnionPay
- TarjetaNaranja

### SchemaValidator

| Method | Description | Parameters |
|--------|-------------|------------|
| `getErrors` | Returns an object containing error messages for the input object, with keys corresponding to the fields in the schema. | `input: any` |

Usage example: 

```js
const validator = new SchemaValidator({
    name: new Validator().notBlank().minLength(3),
    payment: new SchemaValidator({
        sku: new Validator().fixedLength(4).onlyNumbers(),
        price: new NumberValidator().min(0, "cannot be 0 or less"),
        cardNumber: new CardValidator(),
    }),
});

const input = {
    name: ' ',
    payment: {
        cardNumber: '1234',
        sku: '123',
        price: -1,
    },
}

const errors = validator.getErrors(input);

console.log(errors);
/* If no error messages are provided, the default error messages are used:
{
  name: [
    'the value cannot be empty',
    'the value does not meet the minimum length'
  ],
  payment: {
    sku: [ 'the value does not meet the fixed length' ],
    price: [ 'cannot be 0 or less' ],
    cardNumber: [ 'Invalid card number' ]
  }
}
*/
```

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

Usage example: 

```js
import { ArrayValidator, CardValidator, NumberValidator, SchemaValidator, Validator } from "another-validator";

const nameValidator = new Validator().minLength(2).maxLength(20).notEmpty();

const validator = new ArrayValidator(nameValidator)
    .minLength(2)
    .maxLength(5)
    .notEmpty()
    .noDuplicates();


const input = ["John", "Doe", "John", ""];

const errors = validator.getErrorMessages(input);

console.log(errors);
/* If no error messages are provided, the default error messages are used:
[
  'the array must not contain any duplicates',
  'the value does not meet the minimum length',
  'the value cannot be empty'
]
*/
```

### Common methods

These methods are available for all validators.

| Method | Description | Parameters                   |
|--------|-------------|------------------------------|
| `isNullable` | Allows the input to be nullable. | -                            |
| `notNull` | Requires the input to be non-null. | `message?: string` (optional) |
| `isValid` | Checks if the input is valid according to the validation rules. | `input: any`              |
| `getErrorMessages` | Returns an array of error messages for the input based on the validation rules. | `input: any`              |
| `validate` | Validates the input and throws a ValidationError if it does not pass the validation rules. | `input: any`                 |

## <a id="functions"></a> Functions 

### String validations 
| Method                    | Description                    | Parameters                                          |
|---------------------------|--------------------------------|-----------------------------------------------------|
| isEmail                   | Checks if is a valid email address | email: string                                       |
| isUrl                     | Checks if is a valid URL. If strict = true, the url must have a valid protocol (https, http), by default this value is false | url: string, strict?: boolean                       |
| containsOnlyNumbers       | Checks if contains only numbers | input: string                                       |
| containsOnlyLetters       | Checks if contains only letters | input: string                                       |
| containsUppercase         | Checks if contains at least one uppercase letter | input: string                                       |
| containsLowercase         | Checks if contains at least one lowercase letter | input: string                                       |
| containsSpecialCharacter  | Checks if contains at least one special character | input: string                                       |
| containsNumbers           | Checks if contains at least one number | input: string                                       |
| notContainsNumbers        | Checks if does not contain any numbers | input: string                                       |
| notContainsSpecialCharacter | Checks if does not contain any special characters | input: string                                       |
| notContainsWhitespace     | Checks if does not contain any whitespace | input: string                                       |
| isIP                      | Checks if is a valid IP address | input: string                                       |
| isISO8601                 | Checks if is a valid ISO 8601 date or datetime string | dateString: string                                  |
| isBTCAddress              | Checks if is a valid Bitcoin address | address: string                                     |
| isETHAddress              | Checks if is a valid Ethereum address | address: string                                     |
| isJWT                     | Checks if is a valid JSON Web Token (JWT) | token: string                                       |
| isNotBlank                | Checks if is not blank (contains non-whitespace chars) | input: string                                       |
| hasLength                 | Checks if has a specific length | input: string, length: number                       |
| isNotEmpty                | Checks if is not empty         | input: string                                       |
| containsRepeatedChars     | Checks if contains any repeated characters | str: string                                         |

### Credit Card validations

| Method                           | Description                                                                 | Parameters                                                                                       |
|----------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| isAValidCreditCardNumber         | Checks if a string is a valid credit card number using Luhn algorithm       | cardNumber: string                                                                               |
| isExpirationDateValid            | Checks if a credit card expiration date is valid. The format must be (MM/YY) | expirationDate: string                                                                           |
| isCreditCardNumberAndProviderValid | Checks if a credit card number is valid for a given card provider           | cardNumber: string, provider: CardProvider                                                       |
| isCreditCardValid                | Checks if a credit card has a valid number, provider, and expiration date   | {cardNumber: string, provider: CardProvider, expirationDate: string}                            |


## TypeScript Support

This library is written in TypeScript and includes type definitions.

## Contributing

Contributions are welcome! Please feel free to submit a pull request, report an issue, or suggest new features.

## License

This project is licensed under the MIT License.
