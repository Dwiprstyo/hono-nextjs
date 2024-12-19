import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verify = async (
  plainTextPassword: string, 
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};