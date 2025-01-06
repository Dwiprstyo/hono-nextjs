import {
    CreatePostRequest,
    GetPostRequest,
    UpdatePostRequest,
    toPostResponse,
    PostResponse,
    PaginatedResponse
} from "../model/post-model";
import { PostValidation } from "../validation/post-validations";
import { prismaClient } from "../utils/database";
import { HTTPException } from "hono/http-exception";

export class PostService {

    static async get(request: GetPostRequest): Promise<PostResponse | PaginatedResponse<PostResponse>> {
        const result = PostValidation.GET.parse(request)

        if (result.id) {
            const post = await prismaClient.post.findUnique({
                where: { id: result.id }
            })

            if (!post) {
                throw new HTTPException(404, {
                    message: "Post not found"
                })
            }

            return toPostResponse(post);
        }

        const where: { user_id?: number } = {};
        if (result.user_id) {
            where.user_id = result.user_id
        }
        const skip = (result.page - 1) * result.size

        const [posts, total] = await Promise.all([
            prismaClient.post.findMany({
                where,
                skip,
                take: result.size,
                orderBy: {
                    id: 'desc'
                }
            }),
            prismaClient.post.count({ where })
        ])

        if (result.id && posts.length === 0) {
            throw new HTTPException(404, {
                message: "Post not found"
            })
        }

        const totalPages = Math.ceil(total / result.size)

        return {
            data: posts.map(post => toPostResponse(post)),
            paging: {
                current_page: result.page,
                size: result.size,
                total_page: totalPages
            }
        }
    }

    static async create(request: CreatePostRequest): Promise<PostResponse> {
        request = PostValidation.CREATE.parse(request)

        const post = await prismaClient.post.create({
            data: request
        })

        return toPostResponse(post)
    }

    static async update(request: UpdatePostRequest): Promise<PostResponse> {
        const validatedRequest = PostValidation.UPDATE.parse(request);

        try {
            const updatedPost = await prismaClient.post.update({
                where: {
                    id: validatedRequest.id,
                },
                data: {
                    ...(validatedRequest.content && { content: validatedRequest.content }),
                    ...(validatedRequest.image && { image: validatedRequest.image }),
                },
            });

            return toPostResponse(updatedPost);
        } catch (error) {
            if ((error as { code: string }).code === "P2025") {
                throw new HTTPException(404, {
                    message: "Post not found",
                });
            }
            throw error;
        }
    }

    static async delete(postId: number): Promise<boolean> {
        postId = PostValidation.DELETE.parse(postId)

        try {
            await prismaClient.post.delete({
                where: {
                    id: postId
                }
            })
            return true
        } catch (error) {
            if ((error as { code: string }).code === "P2025") {
                throw new HTTPException(404, {
                    message: "Post not found",
                });
            }
            throw error;
        }
    }
}