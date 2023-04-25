import {
    EMAIL_REGEX, IS_IP_REGEX,
    LOWERCASE_REGEX, NO_NUMBERS_REGEX, NO_SPECIAL_CHARS_REGEX, NO_WHITESPACES_REGEX,
    NUMBER_REGEX,
    ONLY_CHARS_REGEX, ONLY_NUMBERS_REGEX, SPECIAL_CHAR_REGEX,
    UPPERCASE_REGEX,
    URL_REGEX
} from "../constants/regex";
import {isValidDate} from "../utils/isValidDate";

const isEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
}

const isUrl = (url: string, strict?: boolean): boolean => {
    if (!strict) {
        return URL_REGEX.test(url);
    }

    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

const containsOnlyNumbers = (input: string): boolean => {
    return ONLY_NUMBERS_REGEX.test(input);
}

const containsOnlyLetters = (input: string): boolean => {
    return ONLY_CHARS_REGEX.test(input);
}

const containsUppercase = (input: string): boolean => {
    return UPPERCASE_REGEX.test(input);
}

const containsLowercase = (input: string): boolean => {
    return LOWERCASE_REGEX.test(input);
}

const containsSpecialCharacter = (input: string): boolean => {
    return SPECIAL_CHAR_REGEX.test(input);
}

const containsNumbers = (input: string): boolean => {
    return NUMBER_REGEX.test(input);
}

const notContainsNumbers = (input: string): boolean => {
    return !NO_NUMBERS_REGEX.test(input);
}

const notContainsSpecialCharacter = (input: string): boolean => {
    return NO_SPECIAL_CHARS_REGEX.test(input);
}

const notContainsWhitespace = (input: string): boolean => {
    return !NO_WHITESPACES_REGEX.test(input);
}

const isIP = (input: string): boolean => {
    return IS_IP_REGEX.test(input);
}

const isISO8601 = (dateString: string): boolean => {
    const ISO8601_DATE_ONLY_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})[-/](1[0-2]|0[1-9])[-/](3[01]|0[1-9]|[12][0-9])$/;
    const ISO8601_DATETIME_REGEX = /^(-?(?:[1-9][0-9]*)?[0-9]{4})[-/](1[0-2]|0[1-9])[-/](3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/;

    const matchesRegex = ISO8601_DATE_ONLY_REGEX.test(dateString) || ISO8601_DATETIME_REGEX.test(dateString);

    return matchesRegex && isValidDate(dateString.replace('/', '-'));
};

const isBTCAddress = (address: string): boolean => {
    const BTC_ADDRESS_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
    return BTC_ADDRESS_REGEX.test(address);
};

const isETHAddress = (address: string): boolean => {
    const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
    return ETH_ADDRESS_REGEX.test(address);
};

const isJWT = (token: string): boolean => {
    const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    return JWT_REGEX.test(token);
};

const isNotBlank = (input: string): boolean => {
    return input.trim() !== '';
}

const hasLength = (input: string, length: number): boolean => {
    return input.length === length;
}

const isNotEmpty = (input: string): boolean => {
    return input !== '';
}

const containsRepeatedChars = (str: string): boolean => {
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

const notContainsRepeatedChars = (str: string): boolean => {
    return !containsRepeatedChars(str);
}

export {
    isIP,
    isUrl,
    isJWT,
    isEmail,
    isISO8601,
    hasLength,
    isNotBlank,
    isNotEmpty,
    isETHAddress,
    isBTCAddress,
    containsNumbers,
    containsUppercase,
    containsLowercase,
    notContainsNumbers,
    containsOnlyNumbers,
    containsOnlyLetters,
    containsRepeatedChars,
    notContainsWhitespace,
    containsSpecialCharacter,
    notContainsRepeatedChars,
    notContainsSpecialCharacter
}

