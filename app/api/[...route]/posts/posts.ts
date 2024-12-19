import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import {
    CreatePostSchema,
    UpdatePostSchema
} from '../../utils/validations';
import { authMiddleware } from '../../middleware/auth';
import { addHours } from 'date-fns';

const prisma = new PrismaClient();
const postRoutes = new Hono();

// Posts Routes
postRoutes.post('/', authMiddleware, zValidator('json', CreatePostSchema), async (c) => {
    try {
        const data = c.req.valid('json');
        
        // Manually adjust time to UTC+7
        const now = new Date();
        const adjustedTime = addHours(now, 7);

        const newPost = await prisma.post.create({
            data: {
                ...data,
                createdAt: adjustedTime,
                updatedAt: adjustedTime
            },
        });
        return c.json(newPost, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Failed to create post' }, 500);
    }
});

postRoutes.put('/:id', authMiddleware, zValidator('json', UpdatePostSchema), async (c) => {
    try {
        const id = Number(c.req.param('id'));
        const data = c.req.valid('json');

        const updatedPost = await prisma.post.update({
            where: { id },
            data
        });

        return c.json(updatedPost);
    } catch (error) {
        return c.json({ error: 'Failed to update post' }, 500);
    }
});

postRoutes.delete('/:id', authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param('id'));
        await prisma.post.delete({ where: { id } });
        return c.json({ message: 'Post deleted successfully' });
    } catch (error) {
        return c.json({ error: 'Failed to delete post' }, 500);
    }
});
export { postRoutes };