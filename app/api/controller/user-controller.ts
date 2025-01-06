import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest, toUserResponse, UpdateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import { ApplicationVariables } from "../model/app-model";
import { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth-middleware";
import { setCookie, deleteCookie } from 'hono/cookie';

export const userController = new Hono<{ Variables: ApplicationVariables }>();

userController.post('/register', async (c) => {
    const request = await c.req.json() as RegisterUserRequest;

    const response = await UserService.register(request)

    return c.json({
        data: response 
    })
})

userController.post('/login', async (c) => {
    const request = await c.req.json() as LoginUserRequest;

    const response = await UserService.login(request);

    if (!response || !response.token) {
        return c.json({
            error: 'Authentication failed.',
        }, 401);
    }

    setCookie(c, 'access-token-1', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
    });

    delete response.token;

    return c.json({
        data: response,
    });
});


userController.use(authMiddleware)

userController.get('/profiles', async (c) => {
    const user = c.get('user') as User

    return c.json({
        data: toUserResponse(user)
    })
})

userController.patch('/profiles', async (c) => {
    const user = c.get('user') as User
    const request = await c.req.json() as UpdateUserRequest;

    const response = await UserService.update(user, request)

    return c.json({
        data: response
    })
})

userController.delete('/profiles', async (c) => {
    deleteCookie(c, 'access-token-1', { path: '/' });

    return c.json({
        data: true
    })
})
