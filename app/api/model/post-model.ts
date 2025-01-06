import {Post, User} from "@prisma/client";

export type GetPostRequest = {
    id?: number,
    user_id?: number,
    page: number,
    size: number
}

export type CreatePostRequest = {
    content: string;
    image?: string;
    user_id: number;
}

export type UpdatePostRequest = {
    id: number,
    content?: string;
    image?: string;
}

export type PostResponse = {
    id: number;
    content: string;
    image?: string | null;
    user_id: number;
}

export function toPostResponse(post: Post): PostResponse {
    return {
        id: post.id,
        content: post.content,
        image: post.image,
        user_id: post.user_id
    }
}