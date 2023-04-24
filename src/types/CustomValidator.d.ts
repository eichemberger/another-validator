export type CustomValidator<T> = {func: (input: any) => boolean, message: string};

export type RuleFunction<T> = (input: any) => boolean;