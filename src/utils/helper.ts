export const isNumeric = (contentToCheck: string) => !isNaN(Number(contentToCheck));

export const sleep = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds));
