export class ValidationError extends Error {
    public errors: any;
    constructor(message: string, errors: any) {
        super();
        this.name = "ValidationError";
        this.message = message;
        this.errors = errors;
    }
}