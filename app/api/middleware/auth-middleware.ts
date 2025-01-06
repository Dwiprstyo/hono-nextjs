import {MiddlewareHandler} from "hono";
import {UserService} from "../service/user-service";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }
    const token = authHeader.split(' ')[1];
    const user = await UserService.get(token)

    c.set('user', user)

    await next()
}