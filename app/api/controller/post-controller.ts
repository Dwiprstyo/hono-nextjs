import { Hono } from "hono";
import { CreatePostRequest, GetPostRequest, UpdatePostRequest } from "../model/post-model";
import { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import { PostService } from "../service/post-service";
import { User } from "@prisma/client";

export const postController = new Hono<{ Variables: ApplicationVariables }>();

postController.get('/', async (c) => {
    const request: GetPostRequest = {
        id: c.req.query("id") ? Number(c.req.query("id")) : undefined,
        user_id: c.req.query("user_id") ? Number(c.req.query("user_id")) : undefined,
        page: c.req.query("page") ? Number(c.req.query("page")) : 1,
        size: c.req.query("size") ? Number(c.req.query("size")) : 10,
    };

    const response = await PostService.get(request);

    return c.json(response)
});

postController.use(authMiddleware)

postController.post('/create', async (c) => {
    const user = c.get('user') as User;
    const request = await c.req.json() as CreatePostRequest;
    request.user_id = user.id
    const response = await PostService.create(request)

    return c.json({
        data: response
    })
})

postController.delete('/:id', async (c) => {
    const postId = Number(c.req.param("id"))
    const response = await PostService.delete(postId)
    return c.json({
        data: response
    })
})

postController.patch('/:id', async (c) => {
    const request = await c.req.json() as UpdatePostRequest;
    const postId = Number(c.req.param("id"))
    request.id = postId;
    const response = await PostService.update(request)

    return c.json({
        data: response
    })
})