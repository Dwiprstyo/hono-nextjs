import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || '';
const TOKEN_EXPIRATION = 7 * 24 * 60 * 60;

export interface JwtPayload {
  user_id: number;
  exp?: number;
  iat?: number;
  [key: string]: string | number | boolean | null | undefined;
}

export const generateToken = async (payload: JwtPayload) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const tokenPayload: JwtPayload = {
    ...payload,
    iat: timestamp,
    exp: timestamp + TOKEN_EXPIRATION
  };
  
  return await sign(tokenPayload, JWT_SECRET, 'HS256');
};

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const payload = await verify(token, JWT_SECRET) as JwtPayload;
    
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && currentTime > payload.exp) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
};