import { z, ZodType } from "zod";

export class PostValidation {

    static readonly CREATE: ZodType = z.object({
        content: z.string().min(1).max(500),
        image: z.string().url().optional(),
        user_id: z.number().positive()
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        content: z.string().min(1).max(500).optional(),
        image: z.string().url().optional(),
    })

    static readonly GET = z.object({
        id: z.number().positive().optional(),
        user_id: z.number().positive().optional(),
        page: z.number().positive(),
        size: z.number().positive().max(100)
    })

    static readonly DELETE: ZodType = z.number().positive()
}