import {CustomValidator, RuleFunction} from "../types/CustomValidator";
import {messages} from "../constants/messages";
import {BaseValidator} from "./base/BaseValidator";
import {
  isUrl,
  isEmail,
  hasLength,
  isNotEmpty,
  isNotBlank,
  containsNumbers,
  containsUppercase,
  containsLowercase,
  notContainsNumbers,
  containsOnlyLetters,
  containsOnlyNumbers,
  notContainsWhitespace,
  containsSpecialCharacter,
  notContainsRepeatedChars,
  notContainsSpecialCharacter
} from "../functions/validations";

interface ValidationAttribute {
    status: boolean;
    value?: any;
    validationFunc: CustomValidator;
}

const buildValidation = (message: string, validationFunc: RuleFunction, value?: any): ValidationAttribute => {
  return {
    status: false,
    validationFunc: {func: validationFunc, message},
    value
  };
};

export class Validator extends BaseValidator<string> {
  // Length
  private minLengthFlag = {value: 0, status: false};
  private fixedLengthFlag = {value: 0, status: false};
  private maxLengthFlag = {value: Infinity, status: false};

  // Contains smt
  private hasNumber = buildValidation(messages.hasNumber,containsNumbers);
  private hasUppercase = buildValidation(messages.hasUppercase, containsUppercase);
  private hasLowercase = buildValidation(messages.hasLowercase, containsLowercase);
  private hasSpecialCharacter = buildValidation(messages.hasSpecialCharacter, containsSpecialCharacter);

  // Only numbers or chars
  private onlyNumbersFlag = buildValidation(messages.onlyNumbers, containsOnlyNumbers);
  private onlyCharactersFlag = buildValidation(messages.onlyCharacters, containsOnlyLetters);

  // Does not contain smt
  private notBlankFlag = buildValidation(messages.notBlank, isNotBlank);
  private noNumbersFlag = buildValidation(messages.noNumbers, notContainsNumbers);
  private noWhitespacesFlag = buildValidation(messages.noWhitespaces, notContainsWhitespace);
  private noRepeatedCharactersFlag = buildValidation(messages.noRepeatedCharacters, notContainsRepeatedChars);
  private noSpecialCharactersFlag = buildValidation(messages.noSpecialCharacters, notContainsSpecialCharacter);

  // special types
  private isUrlFlag = buildValidation(messages.isUrl, isUrl);
  private isEmailFlag = buildValidation(messages.isEmail, isEmail);

  // Other
  private notEmptyFlag = buildValidation(messages.notEmpty, isNotEmpty);

  constructor(field?: string) {
    super(field);
  }

  public notEmpty(message?: string): this {
    this.notEmptyFlag.status = true;
    this.notEmptyFlag.validationFunc.message = message || messages.notEmpty;

    this.rules.push(this.notEmptyFlag.validationFunc);
    return this;
  }

  public notBlank(message?: string): this {
    this.notBlankFlag.status = true;
    this.notBlankFlag.validationFunc.message  = message || messages.notEmpty;

    this.rules.push(this.notBlankFlag.validationFunc);
    return this;
  }

  public fixedLength(length: number, message?: string): this {
    this.haxMinOrMax();
    if (length < 1) {
      throw new Error("fixed length cannot be less than 1");
    }

    this.fixedLengthFlag.value = length;
    this.fixedLengthFlag.status = true;
    this.rules.push({func: (input) =>  hasLength(input, length), message: message || messages.fixedLength});
    return this;
  }

  public isEmail(message?: string): this {
    this.isEmailFlag.status = true;
    if (message !== undefined) {
      this.isEmailFlag.validationFunc.message  = message;
    }

    this.rules.push(this.isEmailFlag.validationFunc);
    return this;
  }

  public isUrl(message?: string): this {
    this.isUrlFlag.status = true;
    if (message !== undefined) {
      this.isUrlFlag.validationFunc.message  = message;
    }

    this.rules.push(this.isUrlFlag.validationFunc);
    return this;
  }

  public minLength(length: number, message?: string): this {
    this.hasFixedLength("minLength");
    if (length > this.maxLengthFlag.value) {
      throw new Error(messages.minLengthGreaterThanMax);
    }
    if (length < 0) {
      throw new Error(messages.minLengthSmallerThanZero);
    }

    this.minLengthFlag.value = length;
    this.minLengthFlag.status = true;
    this.rules.push({func: (input: string) => input.length >= length, message: message || messages.minLength});
    return this;
  }

  public maxLength(length: number, message?: string): this {
    this.hasFixedLength("maxLength");
    if (this.maxLengthFlag.value && length < this.minLengthFlag.value) {
      throw new Error(messages.maxLengthSmallerThanMin);
    }
    if (length < 1) {
      throw new Error(messages.maxLengthSmallerThanOne);
    }

    this.maxLengthFlag.value = length;
    this.maxLengthFlag.status = true;
    this.rules.push({func: (input: string) => input.length <= length, message: message || messages.maxLength});
    return this;
  }

  public requireUppercase(message?: string): this {
    this.hasUppercase.status = true;
    if (message !== undefined) {
      this.hasUppercase.validationFunc.message  = message;
    }

    this.rules.push(this.hasUppercase.validationFunc);
    return this;
  }

  public requireLowercase(message?: string): this {
    this.hasLowercase.status = true;
    if (message !== undefined) {
      this.hasLowercase.validationFunc.message  = message;
    }

    this.rules.push(this.hasLowercase.validationFunc);
    return this;
  }

  public requireNumber(message?: string): this {
    this.hasNoNumber("requireNumber");
    this.hasNumber.status = true;
    if (message !== undefined) {
      this.hasNumber.validationFunc.message  = message;
    }

    this.rules.push(this.hasNumber.validationFunc);
    return this;
  }

  public requireSpecialCharacter(message?: string): this {
    this.hasNoSpecialCharacters("requireSpecialCharacter");
    this.hasSpecialCharacter.status = true;
    if (message !== null && message !== undefined) {
      this.hasSpecialCharacter.validationFunc.message  = message;
    }

    this.rules.push(this.hasSpecialCharacter.validationFunc);
    return this;
  }

  public noWhitespaces(message?: string): this {
    this.noWhitespacesFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noWhitespacesFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noWhitespacesFlag.validationFunc);
    return this;
  }

  public noNumbers(message?: string): this {
    const methodName = "noNumbers";
    this.hasOnlyNumbers(methodName);
    this.hasANumber(methodName);

    this.noNumbersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noNumbersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noNumbersFlag.validationFunc);
    return this;
  }

  public noSpecialCharacters(message?: string): this {
    const methodName = "noSpecialCharacters";
    this.hasSpecialCharacters(methodName);

    this.noSpecialCharactersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noSpecialCharactersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noSpecialCharactersFlag.validationFunc);
    return this;
  }

  public onlyNumbers(message?: string): this {
    const methodName = "onlyNumbers";
    this.hasOnlyChars(methodName);
    this.hasSpecialCharacters(methodName);
    this.hasNoNumber(methodName);

    this.onlyNumbersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.onlyNumbersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.onlyNumbersFlag.validationFunc);
    return this;
  }

  public noRepeatedCharacters(message?: string): this {
    this.noRepeatedCharactersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noRepeatedCharactersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noRepeatedCharactersFlag.validationFunc);
    return this;
  }

  public onlyCharacters(message?: string): this {
    const methodName = "onlyCharacters";
    this.hasOnlyNumbers(methodName);
    this.hasSpecialCharacters(methodName);

    this.onlyCharactersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.onlyCharactersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.onlyCharactersFlag.validationFunc);
    return this;
  }

  private haxMinOrMax() {
    if (this.minLengthFlag.status || this.maxLengthFlag.status) {
      this.throwError("fixedLength", "minLength() or maxLength");
    }
    return false;
  }

  private hasFixedLength(methodName: string): void {
    if (this.fixedLengthFlag.status) {
      this.throwError(methodName, this.fixedLength.name);
    }
  }

  private hasANumber(methodName: string) {
    if (this.hasNumber.status) {
      this.throwError(methodName, this.requireNumber.name);
    }
    return false;
  }

  private hasOnlyNumbers(methodName: string): void {
    if (this.onlyNumbersFlag.status) {
      this.throwError(methodName, this.onlyNumbers.name);
    }
  }

  private hasOnlyChars(methodName: string): void {
    if (this.onlyCharactersFlag.status) {
      this.throwError(methodName, this.onlyCharacters.name);
    }
  }

  private hasSpecialCharacters(methodName: string): void {
    if (this.hasSpecialCharacter.status) {
      this.throwError(methodName, this.requireSpecialCharacter.name);
    }
  }

  private hasNoSpecialCharacters(methodName: string): void {
    if (this.noSpecialCharactersFlag.status) {
      this.throwError(methodName, this.noSpecialCharacters.name);
    }
  }

  private hasNoNumber(methodName: string): void {
    if (this.noNumbersFlag.status) {
      this.throwError(methodName, this.noNumbers.name);
    }
  }

  private throwError(func1Name: string, func2Name: string) {
    throw new Error(`${func1Name}() cannot be used with ${func2Name}()`);
  }

}
