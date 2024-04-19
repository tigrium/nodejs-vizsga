import dotenv from 'dotenv';

export const initProcessEnv = () => {
  const { error } = dotenv.config();
  if (error) {
    throw error;
  }
};

function getProcessEnv<T>(key: string, parser: (value: string) => T, defaultValue?: T): T;
function getProcessEnv(key: string): string;
function getProcessEnv(key: string, defaultValue?: any): string;
function getProcessEnv(key: string, parser?: (value: string) => any, defaultValue?: any): any {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`process.env variable not foud: ${key}`);
  }

  if (parser) {
    return parser(value);
  }
  return value;
}
export { getProcessEnv };
