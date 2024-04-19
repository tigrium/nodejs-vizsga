import { ZodError, ZodType } from 'zod';

export const inputCheck = async (body: any, inputType: ZodType) => {
  const mistakes = [] as string[];
  try {
    await inputType.parseAsync(body);
  } catch (err) {
    if (err instanceof ZodError) {
      console.log('errors', err);
      const errors = err.issues.map((e) => e.message);
      mistakes.push(...errors);
    }
  }
  return mistakes;
};
