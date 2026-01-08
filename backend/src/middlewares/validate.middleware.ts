import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, } from 'zod'

export const valided  = (schema: ZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(422).json({
                    success: false,
                    message: "Validasi gagal",
                    errors: error.flatten().fieldErrors
                });
            }
            next(error);
        }
    };