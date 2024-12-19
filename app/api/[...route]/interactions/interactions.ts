import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import {
    LikeSchema,
    CommentSchema,
    UpdateCommentSchema,
    FollowSchema
} from '../../utils/validations';
import { authMiddleware } from '../../middleware/auth';
import { addHours } from 'date-fns';

const prisma = new PrismaClient();
const interactionRoutes = new Hono();

// Likes Routes
interactionRoutes.post('/likes', authMiddleware, zValidator('json', LikeSchema), async (c) => {
    try {
        const data = c.req.valid('json');

        const now = new Date();
        const adjustedTime = addHours(now, 7);

        // Check if like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: data.userId,
                    postId: data.postId
                }
            }
        });

        if (existingLike) {
            return c.json({ error: 'Already liked' }, 400);
        }

        const newLike = await prisma.like.create({
            data: {
                ...data,
                createdAt: adjustedTime
            }
        });
        return c.json(newLike, 201);
    } catch (error) {
        return c.json({ error: 'Failed to like post' }, 500);
    }
});

interactionRoutes.delete('/likes/:userId/:postId', authMiddleware, async (c) => {
    try {
        const userId = Number(c.req.param('userId'));
        const postId = Number(c.req.param('postId'));

        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        return c.json({ message: 'Like removed successfully' });
    } catch (error) {
        return c.json({ error: 'Failed to remove like' }, 500);
    }
});

// Comments Routes
interactionRoutes.post('/comments', authMiddleware, zValidator('json', CommentSchema), async (c) => {
    try {
        const data = c.req.valid('json');
        const newComment = await prisma.comment.create({ data });
        return c.json(newComment, 201);
    } catch (error) {
        return c.json({ error: 'Failed to create comment' }, 500);
    }
});

interactionRoutes.put('/comments/:id', authMiddleware, zValidator('json', UpdateCommentSchema), async (c) => {
    try {
        const id = Number(c.req.param('id'));
        const data = c.req.valid('json');

        const updatedComment = await prisma.comment.update({
            where: { id },
            data
        });

        return c.json(updatedComment);
    } catch (error) {
        return c.json({ error: 'Failed to update comment' }, 500);
    }
});

interactionRoutes.delete('/comments/:id', authMiddleware, async (c) => {
    try {
        const id = Number(c.req.param('id'));
        await prisma.comment.delete({ where: { id } });
        return c.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        return c.json({ error: 'Failed to delete comment' }, 500);
    }
});

// Follow Routes
interactionRoutes.post('/follow', authMiddleware, zValidator('json', FollowSchema), async (c) => {
    try {
        const data = c.req.valid('json');

        const now = new Date();
        const adjustedTime = addHours(now, 7);

        // Check if follow relationship already exists
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: data.followerId,
                    followingId: data.followingId
                }
            }
        });

        if (existingFollow) {
            return c.json({ error: 'Already following' }, 400);
        }

        const newFollow = await prisma.follow.create({ data: { ...data, createdAt: adjustedTime } });
        return c.json(newFollow, 201);
    } catch (error) {
        return c.json({ error: 'Failed to follow user' }, 500);
    }
});

interactionRoutes.delete('/unfollow/:followerId/:followingId', authMiddleware, async (c) => {
    try {
        const followerId = Number(c.req.param('followerId'));
        const followingId = Number(c.req.param('followingId'));

        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        return c.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        return c.json({ error: 'Failed to unfollow' }, 500);
    }
});

export {interactionRoutes};