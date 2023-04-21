export const buildErrorMsg = (name: string | null) => {
    return `${name == null ? "": name + " "}validation failed`
}