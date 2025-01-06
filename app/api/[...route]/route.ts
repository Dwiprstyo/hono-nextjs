import { Hono } from 'hono'
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { handle } from 'hono/vercel'
import { userController } from '../controller/user-controller';
import { postController } from '../controller/post-controller';

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono! 👋'
  })
})

// Route groups
app.route('/posts', postController);
app.route('/users', userController);

// Error handling
app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status)
    return c.json({
      errors: err.message
    })
  } else if (err instanceof ZodError) {
    c.status(400)
    return c.json({
      errors: err.message
    })
  } else {
    c.status(500)
    return c.json({
      errors: err.message
    })
  }
})

export const GET = handle(app), POST = handle(app), PATCH = handle(app), DELETE = handle(app);