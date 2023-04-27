import {
    camelCaseToSnakeCase,
    keepAlphanumeric,
    keepOnlyCharacters,
    keepOnlyNumbers,
    normalizeSpanishInput, snakeCaseToCamelCase
} from '../../src/sanitizers/strings';

describe('removeSpecialCharacters', () => {
    it('should remove special characters from the input string', () => {
        const input = 'Hello, World! 123';
        const expectedOutput = 'HelloWorld123';
        expect(keepAlphanumeric(input)).toEqual(expectedOutput);
    });

    it('should return an empty string if the input contains only special characters', () => {
        const input = '!@#$%^&*()_+=-';
        const expectedOutput = '';
        expect(keepAlphanumeric(input)).toEqual(expectedOutput);
    });

    it('should return the same input string if it contains only alphanumeric characters', () => {
        const input = 'Abc123XYZ';
        const expectedOutput = 'Abc123XYZ';
        expect(keepAlphanumeric(input)).toEqual(expectedOutput);
    });

    it('should return the same input string if it contains only alphanumeric characters (with ñ)', () => {
        const input = 'Ñoño';
        const expectedOutput = 'Ñoño';
        expect(keepAlphanumeric(input)).toEqual(expectedOutput);
    });

    it('should return an empty string if the input is an empty string', () => {
        const input = '';
        const expectedOutput = '';
        expect(keepAlphanumeric(input)).toEqual(expectedOutput);
    });
});

describe('keepOnlyNumbers', () => {
    it('should keep only numbers from the input string', () => {
        const input = 'Hello, World! 123';
        const expectedOutput = '123';
        expect(keepOnlyNumbers(input)).toEqual(expectedOutput);
    });

    it('should return an empty string if the input contains no numbers', () => {
        const input = 'Hello, World!';
        const expectedOutput = '';
        expect(keepOnlyNumbers(input)).toEqual(expectedOutput);
    });
});

describe('keepOnlyCharacters', () => {
    it('should keep only characters from the input string (including ñ)', () => {
        const input = 'Hello, World! 123Ñoño';
        const expectedOutput = 'HelloWorldÑoño';
        expect(keepOnlyCharacters(input)).toEqual(expectedOutput);
    });

    it('should return an empty string if the input contains no characters', () => {
        const input = '1234567890';
        const expectedOutput = '';
        expect(keepOnlyCharacters(input)).toEqual(expectedOutput);
    });
});

describe('normalizeSpanishInput', () => {
    it('should remove tildes from Spanish vowels and replace ñ with n', () => {
        const input = 'aclaración ñuñoÑuño';
        const expectedOutput = 'aclaracion nunoNuno';
        expect(normalizeSpanishInput(input)).toEqual(expectedOutput);
    });

    it('should return the same input string if it contains no tildes or ñ', () => {
        const input = 'Hello, World! 123';
        const expectedOutput = 'Hello, World! 123';
        expect(normalizeSpanishInput(input)).toEqual(expectedOutput);
    });

    it('should return an empty string if the input is an empty string', () => {
        const input = '';
        const expectedOutput = '';
        expect(normalizeSpanishInput(input)).toEqual(expectedOutput);
    });
});

describe('camelCaseToSnakeCase', () => {
    it('should convert a camelCase string to a snake_case string', () => {
        const input = 'helloWorldFromTypeScript';
        const expectedOutput = 'hello_world_from_type_script';
        expect(camelCaseToSnakeCase(input)).toEqual(expectedOutput);
    });

    it('should return the same input string if it is already in snake_case', () => {
        const input = 'hello_world';
        const expectedOutput = 'hello_world';
        expect(camelCaseToSnakeCase(input)).toEqual(expectedOutput);
    });
});

describe('snakeCaseToCamelCase', () => {
    it('should convert a snake_case string to a camelCase string', () => {
        const input = 'hello_world_from_type_script';
        const expectedOutput = 'helloWorldFromTypeScript';
        expect(snakeCaseToCamelCase(input)).toEqual(expectedOutput);
    });

    it('should return the same input string if it is already in camelCase', () => {
        const input = 'helloWorld';
        const expectedOutput = 'helloWorld';
        expect(snakeCaseToCamelCase(input)).toEqual(expectedOutput);
    });
});