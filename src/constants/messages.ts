export const messages = {
    notEmpty: "the value cannot be empty",
    notBlank: "the value cannot be blank",
    isUrl: "the value is not a valid url",
    isEmail: "the value is not a valid email",
    maxLength: `the value exceeds the maximum length`,
    onlyNumbers: "the value must contain only numbers",
    minGreaterThanMax: "min cannot be greater than max",
    noNumbers: "the value must not contain any numbers",
    maxSmallerThanMin: "max cannot be smaller than min",
    hasNumber: "the value must contain at least one number",
    minLength: "the value does not meet the minimum length",
    fixedLength: "the value does not meet the fixed length",
    onlyCharacters: "the value must contain only characters",
    maxLengthSmallerThanOne: "max length cannot be less than 1",
    minLengthSmallerThanZero: "min length cannot be less than 0",
    customRuleMessage: "the value does not meet the requirements.",
    defaultMessageForError: "the input does not meet the requirements.",
    hasUppercase: "the value must contain at least one uppercase letter",
    hasLowercase: "the value must contain at least one lowercase letter",
    noWhitespaces: "the value must not contain any whitespace characters",
    minLengthGreaterThanMax: "min length cannot be greater than max length",
    maxLengthSmallerThanMin: "max length cannot be smaller than min length",
    noSpecialCharacters: "the value must not contain any special characters",
    noRepeatedCharacters: "the value must not contain any repeated characters",
    hasSpecialCharacter: "the value must contain at least one special character",
};

export const numberMessages = {
    max: "the value exceeds the maximum value",
    min: "the value does not meet the minimum value",
    defaultMessageForError: "the number is not valid",
    minGreaterThanMax: "min cannot be greater than max",
    maxSmallerThanMin: "max cannot be smaller than min",
};

export const arrayMessages = {
    notEmpty: "the array cannot be empty",
    max: "the array exceeds the maximum length",
    defaultMessageForError: "the array is not valid",
    min: "the array does not meet the minimum length",
    noDuplicates: "the array must not contain any duplicates",
};

export const commonMessages = {
    notNull: "the value cannot be null or undefined",
    maxSmallerThanMin: "max cannot be smaller than min",
    minGreaterThanMax: "min cannot be greater than max",
    isNullError: "the value cannot be null or undefined",
};

export const baseMessages = {
    isNullableAndNotNull: "Cannot use notNull() and isNullable() together",
}