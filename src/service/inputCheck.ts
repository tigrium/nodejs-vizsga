import { ZodError, ZodType } from 'zod';

export const inputCheck = async (input: any, inputType: ZodType) => {
  const mistakes = [] as string[];
  try {
    await inputType.parseAsync(input);
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((e) => e.message);
      mistakes.push(...errors);
    }
  }
  return mistakes;
};
