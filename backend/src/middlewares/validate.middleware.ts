import type { Request, Response, NextFunction } from "express";
// Hapus kata 'type' di sini agar ZodError dianggap sebagai Class (Value), bukan cuma Tipe
import { ZodError, type AnyZodObject } from 'zod'; 

export const validate = (schema: AnyZodObject) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validasi dan assign balik ke req.body
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            // Sekarang ini akan berhasil karena ZodError ada di runtime
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