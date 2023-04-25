import {
    isEmail,
    isUrl,
    containsOnlyNumbers,
    containsOnlyLetters,
    containsUppercase,
    containsLowercase,
    containsSpecialCharacter,
    containsNumbers,
    isISO8601,
    isBTCAddress,
    isETHAddress,
    isJWT,
    isNotBlank,
    hasLength,
    notContainsNumbers,
    notContainsSpecialCharacter,
    notContainsWhitespace, isIP
} from "../../src/functions/validations"

describe('Regex validation functions', () => {
    test('isEmail', () => {
        expect(isEmail('test@example.com')).toBe(true);
        expect(isEmail('invalid_email.com')).toBe(false);
    });

    test('isNotBlank', () => {
        expect(isNotBlank('test')).toBe(true);
        expect(isNotBlank('')).toBe(false);
        expect(isNotBlank('   ')).toBe(false);
    })

    test('hasLength', () => {
        expect(hasLength('test', 4)).toBe(true);
        expect(hasLength('test', 5)).toBe(false);
    })

    test('isUrl', () => {
        expect(isUrl('https://www.example.com')).toBe(true);
        expect(isUrl('https://www.example.com', true)).toBe(true);
        expect(isUrl('invalid_url', true)).toBe(false);
        expect(isUrl('www.example.com', false)).toBe(true);
    });

    describe('matching tests', () => {
        test('containsOnlyNumbers', () => {
            expect(containsOnlyNumbers('123456')).toBe(true);
            expect(containsOnlyNumbers('abc123')).toBe(false);
        });

        test('containsOnlyLetters', () => {
            expect(containsOnlyLetters('abcdef')).toBe(true);
            expect(containsOnlyLetters('abc123')).toBe(false);
        });

        test('containsUppercase', () => {
            expect(containsUppercase('Abc')).toBe(true);
            expect(containsUppercase('abc')).toBe(false);
        });

        test('containsLowercase', () => {
            expect(containsLowercase('Abc')).toBe(true);
            expect(containsLowercase('ABC')).toBe(false);
        });

        test('containsSpecialCharacters', () => {
            expect(containsSpecialCharacter('abc!@#$')).toBe(true);
            expect(containsSpecialCharacter('abc123')).toBe(false);
        });

        test('containsNumbers', () => {
            expect(containsNumbers('abc123')).toBe(true);
            expect(containsNumbers('abcdef')).toBe(false);
        });
    })

    describe('isISO8601', () => {
        test('valid dates and datetimes', () => {
            expect(isISO8601('2023-04-25')).toBe(true);
            expect(isISO8601('2023/04/25')).toBe(true);
            expect(isISO8601('2023-04-25T12:34:56Z')).toBe(true);
            expect(isISO8601('2023-04-25T12:34:56.123Z')).toBe(true);
            expect(isISO8601('2023-04-25T12:34:56-07:00')).toBe(true);
            expect(isISO8601('2023/04/25T12:34:56Z')).toBe(true);
            expect(isISO8601('2023/04/25T12:34:56.123Z')).toBe(true);
            expect(isISO8601('2023/04/25T12:34:56-07:00')).toBe(true);
        });

        test('invalid dates and datetimes', () => {
            expect(isISO8601('2023-13-25')).toBe(false);
            expect(isISO8601('2023/13/25')).toBe(false);
            expect(isISO8601('2023-02-30')).toBe(false);
            expect(isISO8601('2023/02/30')).toBe(false);
            expect(isISO8601('2023/02/30')).toBe(false);
            expect(isISO8601('2023-04-25T25:34:56Z')).toBe(false);
            expect(isISO8601('2023-04-25T12:60:56Z')).toBe(false);
            expect(isISO8601('2023-04-25T12:34:60Z')).toBe(false);
            expect(isISO8601('2023/04/25T25:34:56Z')).toBe(false);
            expect(isISO8601('2023/04/25T12:60:56Z')).toBe(false);
            expect(isISO8601('2023/04/25T12:34:60Z')).toBe(false);
        });
    });

    describe('Crypto address validation', () => {
        test('isBTCAddress', () => {
            expect(isBTCAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(true);
            expect(isBTCAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(true);
            expect(isBTCAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(false);
        });

        test('isETHAddress', () => {
            expect(isETHAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(true);
            expect(isETHAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(false);
            expect(isETHAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).toBe(false);
        });
    });

    describe('isJWT', () => {
        test('valid JWT tokens', () => {
            const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            expect(isJWT(validToken)).toBe(true);
        });

        test('invalid JWT tokens', () => {
            const invalidToken1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
            const invalidToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            expect(isJWT(invalidToken1)).toBe(false);
            expect(isJWT(invalidToken2)).toBe(false);
        });
    });

    describe('Negative matching tests', () => {
        test('notContainsNumbers', () => {
            expect(notContainsNumbers('abcdef')).toBe(true);
            expect(notContainsNumbers('abc123')).toBe(false);
            expect(notContainsNumbers('abc!@#')).toBe(true);
        });

        test('notContainsSpecialCharacter', () => {
            expect(notContainsSpecialCharacter('abcdef')).toBe(true);
            expect(notContainsSpecialCharacter('abc123')).toBe(true);
            expect(notContainsSpecialCharacter('abc!@#')).toBe(false);
        });

        test('notContainsWhitespace', () => {
            expect(notContainsWhitespace('abcdef')).toBe(true);
            expect(notContainsWhitespace('abc 123')).toBe(false);
            expect(notContainsWhitespace('abc\t123')).toBe(false);
            expect(notContainsWhitespace('abc\n123')).toBe(false);
        });
    });

    describe("isIP", () => {
        it("returns true for valid IP addresses", () => {
            expect(isIP("0.0.0.0")).toBe(true);
            expect(isIP("192.168.1.1")).toBe(true);
            expect(isIP("172.16.0.0")).toBe(true);
            expect(isIP("255.255.255.255")).toBe(true);
        });

        it("returns false for invalid IP addresses", () => {
            expect(isIP("")).toBe(false);
            expect(isIP("256.0.0.0")).toBe(false);
            expect(isIP("1.2.3.4.5")).toBe(false);
            expect(isIP("192.168.0.1/24")).toBe(false);
            expect(isIP("hello.world")).toBe(false);
        });
    });

});
