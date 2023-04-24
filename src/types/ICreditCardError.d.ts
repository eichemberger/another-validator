export type ICreditCardError = {
    expirationDate?: string;
    provider?: string;
    number?: string;
    messages?: string[];
}