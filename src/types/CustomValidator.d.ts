export type CustomValidator<T> = {func: RuleFunction<T>, message: string};

export type RuleFunction<T> = (input: T) => boolean;