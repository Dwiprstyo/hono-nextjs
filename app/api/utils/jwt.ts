import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Add index signature to make it compatible with Hono's JWTPayload
export interface JwtPayload {
  userId: number;
  email: string;
  [key: string]: string | number | boolean | null; // Add index signature
}

export const generateToken = async (payload: JwtPayload) => {
  return await sign(payload, JWT_SECRET, 'HS256');
};

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    return await verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};