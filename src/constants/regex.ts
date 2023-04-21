const NUMBER_REGEX = new RegExp(/\d/);
const NO_NUMBERS_REGEX = new RegExp(/\d/);
const UPPERCASE_REGEX = new RegExp(/[A-Z]/);
const LOWERCASE_REGEX = new RegExp(/[a-z]/);
const NO_WHITESPACES_REGEX = new RegExp(/\s/);
const SPECIAL_CHAR_REGEX = new RegExp(/[\W_]/);
const ONLY_NUMBERS_REGEX = new RegExp(/^\d+$/);
const ONLY_CHARS_REGEX = new RegExp(/^[a-zA-Z]+$/);
const NO_SPECIAL_CHARS_REGEX = new RegExp(/^[a-zA-Z0-9]*$/);
const URL_REGEX = new RegExp(/^(?:(?:https?|ftp):\/\/)?[a-zA-Z0-9_\-]+(\.[a-zA-Z0-9_\-]+)*\.[a-zA-Z]{2,5}(\/[a-zA-Z0-9_\-]+)*(\?[a-zA-Z0-9_\-]+=[a-zA-Z0-9_\-]+(&[a-zA-Z0-9_\-]+=[a-zA-Z0-9_\-]+)*)?$/);
const EMAIL_REGEX = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);

export {
    NUMBER_REGEX,
    NO_NUMBERS_REGEX,
    UPPERCASE_REGEX,
    LOWERCASE_REGEX,
    NO_WHITESPACES_REGEX,
    SPECIAL_CHAR_REGEX,
    ONLY_NUMBERS_REGEX,
    ONLY_CHARS_REGEX,
    NO_SPECIAL_CHARS_REGEX,
    URL_REGEX,
    EMAIL_REGEX,
};