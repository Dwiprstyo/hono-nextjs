import { Hono } from 'hono';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../utils/jwt';
import { hash, verify } from '../../utils/bcrypt';
import { RegisterUserSchema, LoginUserSchema } from '../../utils/validations';
import { addHours } from 'date-fns';

const authRoutes = new Hono();
const prisma = new PrismaClient();

authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = RegisterUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    });

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password);
    const now = new Date();
    const adjustedTime = addHours(now, 7);
    // Create user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        createdAt: adjustedTime,
        updatedAt: adjustedTime
      }
    });

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email
    });

    return c.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Registration failed' }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = LoginUserSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isPasswordValid = await verify(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email
    });

    return c.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Login failed' }, 500);
  }
});

export { authRoutes };