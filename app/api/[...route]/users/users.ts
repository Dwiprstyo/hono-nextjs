import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { hash, verify } from '../../utils/bcrypt';
import { ProfileUpdateSchema } from '../../utils/validations';
import { authMiddleware } from '../../middleware/auth';

const prisma = new PrismaClient();
const userRoutes = new Hono();

// Get User Profile
userRoutes.get('/profile/:id', authMiddleware, async (c) => {
    try {
        const userId = Number(c.req.param('id'));

        const profile = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatar: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true
                    }
                }
            }
        });

        if (!profile) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({...profile});
    } catch (error) {
        return c.json({ error: 'Failed to fetch profile' }, 500);
    }
});

// Update User Profile
userRoutes.put('/profile', authMiddleware, zValidator('json', ProfileUpdateSchema), async (c) => {
    try {
        const data = c.req.valid('json');
        const userId = c.get('userId'); // Assuming authMiddleware sets userId

        // Check if username is already taken
        if (data.username) {
            const existingUsername = await prisma.user.findUnique({
                where: { username: data.username }
            });
            if (existingUsername && existingUsername.id !== userId) {
                return c.json({ error: 'Username is already taken' }, 400);
            }
        }

        // Check if email is already taken
        if (data.email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email: data.email }
            });
            if (existingEmail && existingEmail.id !== userId) {
                return c.json({ error: 'Email is already in use' }, 400);
            }
        }

        // Password update logic
        const updateData: any = { ...data };

        if (data.newPassword) {
            // Verify current password before allowing password change
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user || !await verify(data.currentPassword || '', user.password)) {
                return c.json({ error: 'Current password is incorrect' }, 400);
            }

            // Hash new password
            updateData.password = await hash(data.newPassword);
        }

        // Remove unnecessary fields
        delete updateData.currentPassword;
        delete updateData.confirmNewPassword;
        delete updateData.newPassword;

        // Update profile
        const updatedProfile = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                avatar: true
            }
        });

        return c.json(updatedProfile);
    } catch (error) {
        console.error('Profile update error:', error);
        return c.json({ error: 'Failed to update profile' }, 500);
    }
});

// Get User's Posts
userRoutes.get('/profile/:id/posts', authMiddleware, async (c) => {
    try {
        const userId = Number(c.req.param('id'));
        const page = Number(c.req.query('page') || '1');
        const limit = Number(c.req.query('limit') || '10');

        const posts = await prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                _count: {
                    select: { likes: true, comments: true }
                }
            }
        });

        const totalPosts = await prisma.post.count({ where: { userId } });

        return c.json({
            posts: posts.map(post => ({
                ...post,
                likeCount: post._count.likes,
                commentCount: post._count.comments
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts
            }
        });
    } catch (error) {
        return c.json({ error: 'Failed to fetch user posts' }, 500);
    }
});

// Get User's Followers
userRoutes.get('/profile/:id/followers', authMiddleware, async (c) => {
    try {
        const userId = Number(c.req.param('id'));
        const page = Number(c.req.query('page') || '1');
        const limit = Number(c.req.query('limit') || '10');

        const followers = await prisma.follow.findMany({
            where: { followingId: userId },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        bio: true
                    }
                }
            }
        });

        const totalFollowers = await prisma.follow.count({
            where: { followingId: userId }
        });

        return c.json({
            followers: followers.map(f => f.follower),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFollowers / limit),
                totalFollowers
            }
        });
    } catch (error) {
        return c.json({ error: 'Failed to fetch followers' }, 500);
    }
});

// Get Users Being Followed
userRoutes.get('/profile/:id/following', authMiddleware, async (c) => {
    try {
        const userId = Number(c.req.param('id'));
        const page = Number(c.req.query('page') || '1');
        const limit = Number(c.req.query('limit') || '10');

        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        bio: true
                    }
                }
            }
        });

        const totalFollowing = await prisma.follow.count({
            where: { followerId: userId }
        });

        return c.json({
            following: following.map(f => f.following),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFollowing / limit),
                totalFollowing
            }
        });
    } catch (error) {
        return c.json({ error: 'Failed to fetch following' }, 500);
    }
});

export {userRoutes};