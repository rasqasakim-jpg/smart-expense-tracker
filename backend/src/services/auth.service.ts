import prisma from '../database';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../utils/hash';

export class AuthService {
    async registerUser(data: any) {
        const { fullName, email, password } = data; // Sesuai API Contract

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const error: any = new Error("Email sudah terdaftar");
            error.status = 400;
            throw error;
        }

        const hashedPassword = await hashPassword(password);

        return await prisma.user.create({
            data: {
                full_name: fullName,
                email,
                password: hashedPassword,
                role: 'USER'
            },
            select: {
                id: true,
                email: true,
                full_name: true
            }
        });
    }

    async loginUser(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const error: any = new Error("Email atau password salah");
            error.status = 401
            throw error
        };

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            const error: any = new Error("Email atau password salah");
            error.status = 401;
            throw error;
        };


        const secret = process.env.JWT_SECRET || 'super_secret_key'
        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: '1d' }
        );


        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name
            }
        };
    }

}