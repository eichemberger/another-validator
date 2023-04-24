export interface IValidator<T> {
    isValid(input: T): boolean;
    validate(input: T): void;
    getErrorMessages(input: T): string[];
}