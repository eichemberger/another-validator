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

### Validator 
```js
import Validator from "<your-package-name>";

const validator = new Validator()
  .minLength(5)
  .maxLength(10)
  .requireLowercase("this input requires a lowercase letter")
  .requireUppercase()
    .

const password = "P@ssw0rd";

// Validate password
const isValid = validator.isValid(password); // Returns true if the password meets the requirements

// Get password strength score and description
try {
    validator.validate(password); // throws an error if not valid       
} catch (e) {
    console.log(e.errors); // contains an array with all the erros 
}



// Add custom validation function
validator.addCustomValidator((password) => {
  return !password.includes("example");
});

// Assert password validity (throws error if invalid)
validator.assertPasswordIsValid(password);
```

The custom validation function should return a boolean value. If the function returns `true`, the password is considered valid. If the function returns `false`, the password is considered invalid.

## Contributing

Contributions are welcome! Please feel free to submit a pull request, report an issue, or suggest new features.

## License

This project is licensed under the MIT License.
