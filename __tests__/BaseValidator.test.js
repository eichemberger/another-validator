"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationError_1 = require("../src/errors/ValidationError");
const messages_1 = require("../src/constants/messages");
const BaseValidator_1 = require("../src/validators/BaseValidator");
class TestValidator extends BaseValidator_1.BaseValidator {
    testHandlePossibleNull(input) {
        return this.handlePossibleNull(input);
    }
}
describe("BaseValidator", () => {
    let testValidator;
    beforeEach(() => {
        testValidator = new TestValidator();
    });
    test("should not throw an error for non-null inputs", () => {
        const input = "test";
        expect(() => testValidator.testHandlePossibleNull(input)).not.toThrow(ValidationError_1.ValidationError);
    });
    test("should throw an error for null inputs", () => {
        const input = null;
        expect(() => testValidator.testHandlePossibleNull(input)).toThrow(ValidationError_1.ValidationError);
    });
    test("should throw an error for undefined inputs", () => {
        const input = undefined;
        expect(() => testValidator.testHandlePossibleNull(input)).toThrow(ValidationError_1.ValidationError);
    });
    test("should not throw an error for null inputs when isNullable", () => {
        const input = null;
        testValidator.isNullable();
        expect(() => testValidator.testHandlePossibleNull(input)).not.toThrow(ValidationError_1.ValidationError);
    });
    test("should not throw an error for undefined inputs when isNullable", () => {
        const input = undefined;
        testValidator.isNullable();
        expect(() => testValidator.testHandlePossibleNull(input)).not.toThrow(ValidationError_1.ValidationError);
    });
    test("should throw an error with custom message for null inputs when notNull", () => {
        const input = null;
        const customMessage = "Custom not null message";
        testValidator.notNull(customMessage);
        try {
            testValidator.testHandlePossibleNull(input);
        }
        catch (error) {
            if (error instanceof ValidationError_1.ValidationError) {
                expect(error.errors).toContain(customMessage);
            }
            else {
                fail("Expected a ValidationError");
            }
        }
    });
    test("should throw an error with default message for null inputs when notNull", () => {
        const input = null;
        testValidator.notNull();
        try {
            testValidator.testHandlePossibleNull(input);
        }
        catch (error) {
            if (error instanceof ValidationError_1.ValidationError) {
                expect(error.errors).toContain(messages_1.commonMessages.notNull);
            }
            else {
                fail("Expected a ValidationError");
            }
        }
    });
});
