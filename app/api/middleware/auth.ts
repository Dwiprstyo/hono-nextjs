import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CustomVariables {
  userId: number;
}
type CustomContext = Context<{ Variables: CustomVariables }>;

export const authMiddleware = async (c: CustomContext, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token);

  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  c.set('userId', user.id);
  await next();
};