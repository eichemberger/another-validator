import {tildesMap} from "../constants/tildes";

type TildesMapType = typeof tildesMap;

const keepAlphanumeric = (input: string): string => {
    const regex = /[^a-zA-Z0-9ñÑ]/g;
    return input.replace(regex, '');
}

const keepOnlyNumbers = (input: string): string => {
    const regex = /[^0-9]/g;
    return input.replace(regex, '');
}

const keepOnlyCharacters = (input: string): string => {
    const regex = /[^a-zA-ZñÑ]/g;
    return input.replace(regex, '');
}

const camelCaseToSnakeCase = (input: string): string => {
    return input.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

const snakeCaseToCamelCase = (input: string): string => {
    return input.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
}

const normalizeSpanishInput = (input: string): string => {
    return input.replace(/[áéíóúÁÉÍÓÚñÑ]/g, (match) => tildesMap[match as keyof TildesMapType]);
}

export {
    keepOnlyNumbers,
    keepAlphanumeric,
    keepOnlyCharacters,
    snakeCaseToCamelCase,
    camelCaseToSnakeCase,
    normalizeSpanishInput
}