import { ZodObject, ZodError, } from 'zod';
export const valided = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
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
//# sourceMappingURL=validate.middleware.js.map