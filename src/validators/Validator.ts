import {CustomValidator, RuleFunction} from "../types/CustomValidator";
import {messages} from "../constants/messages";
import {
  EMAIL_REGEX,
  LOWERCASE_REGEX,
  NO_NUMBERS_REGEX,
  NO_SPECIAL_CHARS_REGEX,
  NO_WHITESPACES_REGEX,
  NUMBER_REGEX,
  ONLY_CHARS_REGEX,
  ONLY_NUMBERS_REGEX,
  SPECIAL_CHAR_REGEX,
  UPPERCASE_REGEX,
  URL_REGEX,
} from "../constants/regex";
import {BaseValidator} from "./BaseValidator";
import {ValidationError} from "../errors/ValidationError";
import {buildErrorMsg} from "../utils/buildErrorMsg";
import {IValidator} from "../types/IValidator";

interface ValidationAttribute {
    status: boolean;
    value?: any;
    validationFunc: CustomValidator<string>;
}

const buildValidation = (message: string, validationFunc: RuleFunction<string>, value?: any): ValidationAttribute => {
  return {
    status: false,
    validationFunc: {func: validationFunc, message},
    value
  }
}

export class Validator extends BaseValidator implements IValidator<string> {
  private rules: CustomValidator<string>[] = [];
  private isUrlFlag = buildValidation(messages.isUrl, (input: string) => URL_REGEX.test(input));
  private notEmptyFlag = buildValidation(messages.notEmpty, (input) => !(input.length === 0))
  private isEmailFlag = buildValidation(messages.isEmail, (input) => EMAIL_REGEX.test(input))
  private hasNumber = buildValidation(messages.hasNumber,(input) => NUMBER_REGEX.test(input))
  private notBlankFlag = buildValidation(messages.notBlank, (input) => !(input.trim().length === 0))
  private noNumbersFlag = buildValidation(messages.noNumbers, (input) => !NO_NUMBERS_REGEX.test(input))
  private hasUppercase = buildValidation(messages.hasUppercase, (input) => UPPERCASE_REGEX.test(input))
  private hasLowercase = buildValidation(messages.hasLowercase, (input) => LOWERCASE_REGEX.test(input))
  private onlyNumbersFlag = buildValidation(messages.onlyNumbers, (input) => ONLY_NUMBERS_REGEX.test(input))
  private onlyCharactersFlag = buildValidation(messages.onlyCharacters, (input) => ONLY_CHARS_REGEX.test(input))
  private noWhitespacesFlag = buildValidation(messages.noWhitespaces, (input) => !NO_WHITESPACES_REGEX.test(input))
  private hasSpecialCharacter = buildValidation(messages.hasSpecialCharacter, (input) => SPECIAL_CHAR_REGEX.test(input));
  private minLengthFlag = buildValidation(messages.minLength, (input) => input.length < this.minLengthFlag.value, 0)
  private maxLengthFlag = buildValidation(messages.maxLength, (input) => input.length > this.maxLengthFlag.value, Infinity);
  private noRepeatedCharactersFlag = buildValidation(messages.noRepeatedCharacters, (input) => !this._hasRepeatedChars(input));
  private noSpecialCharactersFlag = buildValidation(messages.noSpecialCharacters, (input) => NO_SPECIAL_CHARS_REGEX.test(input));
  private fixedLengthFlag = buildValidation(messages.fixedLength, (input) => input.length === this.fixedLengthFlag.value, 0)

  constructor(field?: string) {
    super(field);
  }

  public notEmpty(message?: string): this {
    this.notEmptyFlag.status = true;
    this.notEmptyFlag.validationFunc.message = message || messages.notEmpty;

    this.rules.push(this.notEmptyFlag.validationFunc)
    return this;
  }

  public notBlank(message?: string): this {
    this.notBlankFlag.status = true;
    this.notBlankFlag.validationFunc.message  = message || messages.notEmpty;

    this.rules.push(this.notBlankFlag.validationFunc)
    return this;
  }

  public fixedLength(length: number, message?: string): this {
    this._haxMinOrMax();
    if (length < 1) {
      throw new Error("fixed length cannot be less than 1");
    }
    if (message !== undefined) {
      this.fixedLengthFlag.validationFunc.message  = message;
    }
    if (this.maxLengthFlag.status) {
      this.maxLengthFlag.value = length;
    }
    if (this.minLengthFlag.status) {
      this.minLengthFlag.value = length;
    }

    this.fixedLengthFlag.value = length;
    this.fixedLengthFlag.status = true;
    this.rules.push(this.fixedLengthFlag.validationFunc);
    return this;
  }

  public isEmail(message?: string): this {
    this.isEmailFlag.status = true;
    if (message !== undefined) {
      this.isEmailFlag.validationFunc.message  = message;
    }

    this.rules.push(this.isEmailFlag.validationFunc)
    return this;
  }

  public isUrl(message?: string): this {
    this.isUrlFlag.status = true;
    if (message !== undefined) {
      this.isUrlFlag.validationFunc.message  = message;
    }

    this.rules.push(this.isUrlFlag.validationFunc)
    return this;
  }

  public minLength(length: number, message?: string): this {
    if (length > this.maxLengthFlag.value) {
      throw new Error(messages.minLengthGreaterThanMax);
    }
    if (length < 0) {
      throw new Error(messages.minLengthSmallerThanZero);
    }
    if (message !== undefined) {
      this.minLengthFlag.validationFunc.message  = message;
    }

    this.minLengthFlag.value = length;
    this.minLengthFlag.status = true;
    this.minLengthFlag.validationFunc.func = (input: string) => input.length > length;
    this.rules.push(this.minLengthFlag.validationFunc);
    return this;
  }

  public maxLength(length: number, message?: string): this {
    if (this.maxLengthFlag.value && length < this.minLengthFlag.value) {
      throw new Error("max length cannot be less than then min length");
    }
    if (length < 1) {
      throw new Error(messages.maxLengthSmallerThanOne);
    }
    if (message !== undefined) {
      this.maxLengthFlag.validationFunc.message  = message;
    }

    this.maxLengthFlag.value = length;
    this.maxLengthFlag.status = true;
    this.maxLengthFlag.validationFunc.func = (input: string) => input.length < length;
    this.rules.push(this.maxLengthFlag.validationFunc);
    return this;
  }

  public addRule(rule: (password: string) => boolean, message?: string): this {
    const newRule = { func: rule, message: messages.customRuleMessage };
    if (message !== null && message !== undefined) {
      newRule.message = message;
    }
    this.rules.push(newRule);
    return this;
  }

  public requireUppercase(message?: string): this {
    this.hasUppercase.status = true;
    if (message !== undefined) {
      this.hasUppercase.validationFunc.message  = message;
    }

    this.rules.push(this.hasUppercase.validationFunc)
    return this;
  }

  public requireLowercase(message?: string): this {
    this.hasLowercase.status = true;
    if (message !== undefined) {
      this.hasLowercase.validationFunc.message  = message;
    }

    this.rules.push(this.hasLowercase.validationFunc)
    return this;
  }

  public requireNumber(message?: string): this {
    this.hasNumber.status = true;
    if (message !== undefined) {
      this.hasNumber.validationFunc.message  = message;
    }

    this.rules.push(this.hasNumber.validationFunc)
    return this;
  }

  public requireSpecialCharacter(message?: string): this {
    this.hasSpecialCharacter.status = true;
    if (message !== null && message !== undefined) {
      this.hasSpecialCharacter.validationFunc.message  = message;
    }

    this.rules.push(this.hasSpecialCharacter.validationFunc)
    return this;
  }

  public noWhitespaces(message?: string): this {
    this.noWhitespacesFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noWhitespacesFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noWhitespacesFlag.validationFunc)
    return this;
  }

  public noNumbers(message?: string): this {
    const methodName = "noNumbers";
    this._hasOnlyNumbers(methodName);

    this.noNumbersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noNumbersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noNumbersFlag.validationFunc)
    return this;
  }

  public noSpecialCharacters(message?: string): this {
    const methodName = "noSpecialCharacters";
    this._hasOnlyNumbers(methodName);
    this._hasSpecialCharacters(methodName);

    this.noSpecialCharactersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noSpecialCharactersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noSpecialCharactersFlag.validationFunc)
    return this;
  }

  public onlyNumbers(message?: string): this {
    const methodName = "onlyNumbers";
    this._hasOnlyChars(methodName);
    this._hasSpecialCharacters(methodName);

    this.onlyNumbersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.onlyNumbersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.onlyNumbersFlag.validationFunc)
    return this;
  }

  private _haxMinOrMax() {
    if (this.minLengthFlag.status || this.maxLengthFlag.status) {
      this._throwError("fixedLength", "minLength() or maxLength");
    }
    return false;
  }

  public noRepeatedCharacters(message?: string): this {
    this.noRepeatedCharactersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.noRepeatedCharactersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.noRepeatedCharactersFlag.validationFunc)
    return this;
  }

  public onlyCharacters(message?: string): this {
    const methodName = "onlyCharacters";
    this._hasOnlyNumbers(methodName);
    this._hasSpecialCharacters(methodName);

    this.onlyCharactersFlag.status = true;
    if (message !== null && message !== undefined) {
      this.onlyCharactersFlag.validationFunc.message  = message;
    }

    this.rules.push(this.onlyCharactersFlag.validationFunc)
    return this;
  }

  private _hasOnlyNumbers(methodName: string): void {
    if (this.onlyNumbersFlag.status) {
      this._throwError(methodName, this.onlyNumbers.name);
    }
  }

  private _hasOnlyChars(methodName: string): void {
    if (this.onlyNumbersFlag.status) {
      this._throwError(methodName, this.onlyCharacters.name);
    }
  }

  private _hasSpecialCharacters(methodName: string): void {
    if (this.hasSpecialCharacter.status) {
      this._throwError(methodName, this.requireSpecialCharacter.name);
    }
  }

  private _throwError(func1Name: string, func2Name: string) {
    throw new Error(`${func1Name}() cannot be used with ${func2Name}()`);
  }

  private _hasRepeatedChars(str: string): boolean {
    const hashTable: { [key: string]: boolean } = {};
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      if (hashTable[char]) {
        return true;
      }
      hashTable[char] = true;
    }
    return false;
  }

  public isValid(input: string) : boolean {
    try {
        this.validate(input);
        return true;
    } catch (e) {
        return false;
    }
  }

  public getErrorMessages(input: string): string[] {
    const nullError = this.handlePossibleNull(input);
    if (nullError.length > 0) {
      return nullError;
    }

    const errorMessages: string[] = [];

    for (const rule of this.rules) {
      if (!rule.func(input)) {
        errorMessages.push(rule.message);
      }
    }

    return errorMessages;
  }

  public validate(input: string): void {
    const errors = this.getErrorMessages(input);

    if (errors.length > 0) {
      throw new ValidationError(buildErrorMsg(this.name), messages);
    }
  }

  public assertIsValid(input: string): void {
    for (const rule of this.rules) {
      if (!rule.func(input)) {
        throw new ValidationError(rule.message, [rule.message]);
      }
    }
  }

}
