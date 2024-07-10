import { config } from 'src/config/config';

export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: config.BCRYPT_ROUND,
  });
}

export async function comparePassword(
  password: string,
  hashPassword: string,
): Promise<boolean> {
  return Bun.password.verify(password, hashPassword);
}
