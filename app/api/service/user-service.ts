import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UpdateUserRequest,
    UserResponse
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { prismaClient } from "../utils/database";
import { HTTPException } from "hono/http-exception";
import { User } from "@prisma/client";
import { hash, verify } from '../utils/bcrypt';
import { generateToken } from "../utils/jwt";
import { verifyToken } from '../utils/jwt';

export class UserService {

    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        request = UserValidation.REGISTER.parse(request)

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: request.username
            }
        })

        if (totalUserWithSameUsername != 0) {
            throw new HTTPException(400, {
                message: "Username already exists"
            })
        }

        request.password = await hash(request.password);

        const user = await prismaClient.user.create({
            data: request
        })

        return toUserResponse(user)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        request = UserValidation.LOGIN.parse(request)

        let user = await prismaClient.user.findUnique({
            where: {
                username: request.username
            }
        })

        if (!user) {
            throw new HTTPException(401, {
                message: "Username or password is wrong"
            })
        }

        const isPasswordValid = await verify(request.password, user.password);

        if (!isPasswordValid) {
            throw new HTTPException(401, {
                message: "Username or password is wrong"
            })
        }

        const token = await generateToken({
            user_id: user.id
        });

        const response = toUserResponse(user)
        response.token = token;
        return response
    }

    static async get(token: string | undefined | null): Promise<User> {
        const result = UserValidation.TOKEN.safeParse(token)

        if (result.error) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            })
        }

        token = result.data;
        const payload = await verifyToken(token!);
        
        if (!payload) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            })
        }

        const user = await prismaClient.user.findFirst({
            where: {
                id: payload?.user_id
            }
        })

        if (!user) {
            throw new HTTPException(401, {
                message: "Unauthorized"
            })
        }

        return user;
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        request = UserValidation.UPDATE.parse(request)

        if (request.name) {
            user.name = request.name
        }

        if (request.password) {
            user.password = await hash(request.password);
        }

        user = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: user
        })

        return toUserResponse(user)
    }
}