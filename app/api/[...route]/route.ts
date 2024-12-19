import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel'
import { authRoutes } from './auth/auth';
import { postRoutes } from './posts/posts';
import { interactionRoutes } from './interactions/interactions';
import { userRoutes } from './users/users';

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

// Middleware
app.use('*', cors());

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono! 👋'
  })
})

// Route groups
app.route('/auth', authRoutes);
app.route('/posts', postRoutes);
app.route('/users', userRoutes);
app.route('/interactions', interactionRoutes);

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export const GET = handle(app), POST = handle(app), PUT = handle(app), DELETE = handle(app);