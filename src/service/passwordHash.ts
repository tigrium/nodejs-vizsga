import { createHmac } from 'crypto';
import { getProcessEnv } from './processEnv';

export const getPasswordHash = (pass: string) => {
  return createHmac('sha256', getProcessEnv('PASS_SECRET')).update(pass).digest('base64');
};
