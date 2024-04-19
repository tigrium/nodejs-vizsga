import * as z from 'zod';
import { MIN_NICKNAME_LENGTH, MIN_PASS_LENGTH } from './models';

const emailCheck = z.string().email({ message: 'Az e-mail cím nem megfelelő formátumú.' });
const passCheck = z.string().min(MIN_PASS_LENGTH, { message: `A jelszó legyen legalább ${MIN_PASS_LENGTH} hosszú!` });

export const ProfileInput = z.object({
  email: emailCheck,
  pass: passCheck,
  passAgain: passCheck,
  nickname: z
    .string()
    .min(MIN_NICKNAME_LENGTH, { message: `A megjelenítendő név legyen legalább ${MIN_NICKNAME_LENGTH} hosszú!` }),
});

export const LoginInput = z.object({
  email: emailCheck,
  pass: passCheck,
});

export const forgotPassSecretInput = z.string().uuid({ message: 'Érvénytelen azonosító.' });

export const SetPassInput = z.object({
  pass: passCheck,
  passAgain: passCheck,
});

export const ForgotPassInput = z.object({
  email: emailCheck,
});

export const postInput = z.object({
  text: z.string().min(1, { message: 'A megosztott gondolat ne legyen üres!' }),
});

export const postIdInput = z.string().uuid({ message: 'Érvénytelen postId.' });
