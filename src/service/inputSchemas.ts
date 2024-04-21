import * as z from 'zod';
import { MIN_NICKNAME_LENGTH as MIN_NAME_LENGTH, MIN_PASS_LENGTH } from './models';

const emailCheck = z.string().email({ message: 'Az e-mail cím nem megfelelő formátumú.' });
const passCheck = z.string().min(MIN_PASS_LENGTH, { message: `A jelszó legyen legalább ${MIN_PASS_LENGTH} karakter hosszú!` });

export const ProfileInput = z.object({
  email: emailCheck,
  pass: passCheck,
  passAgain: passCheck,
  name: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `A megjelenítendő név legyen legalább ${MIN_NAME_LENGTH} karakter hosszú!` }),
});

export const ProfileInputWithoutPass = z.object({
  email: emailCheck,
  name: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `A megjelenítendő név legyen legalább ${MIN_NAME_LENGTH} karakter hosszú!` }),
});

export const LoginInput = z.object({
  email: emailCheck,
  pass: passCheck,
});

export const UuidInput = z.string().uuid({ message: 'Érvénytelen azonosító.' });

export const SetPassInput = z.object({
  pass: passCheck,
  passAgain: passCheck,
});

export const ForgotPassInput = z.object({
  email: emailCheck,
});

export const PostInput = z.object({
  text: z.string().min(1, { message: 'A megosztott gondolat ne legyen üres!' }),
});
