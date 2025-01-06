import {User} from "@prisma/client";

export type RegisterUserRequest = {
    username: string;
    password: string;
    name: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UpdateUserRequest = {
    password?: string;
    name?: string;
}

export type UserResponse = {
    id: number;
    username: string;
    name: string;
    token?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        username: user.username
    }
}