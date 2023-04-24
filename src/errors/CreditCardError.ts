import {ICreditCardError} from "../types/ICreditCardError";

export class CreditCardError extends Error {
    public errors: any;
    constructor(errors: ICreditCardError | ICreditCardError[]) {
        super();
        this.name = "CreditCardError";
        this.errors = errors;
    }
}