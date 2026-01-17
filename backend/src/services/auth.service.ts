import prisma from '../database';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../utils/hash';
import { ActivityLogService } from './activity-log.service';
import { ActivityAction } from '../types/activity.types';

export class AuthService {

    private activityLogService: ActivityLogService;

    constructor() {
        this.activityLogService = new ActivityLogService();
    }
    async registerUser(data: any) {
        const { fullName, email, password } = data;


        if (!fullName || !email || !password) {
            throw new Error("Full name, email, and password are required");
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email sudah terdaftar");
        }

        // --- PERBAIKAN DI SINI ---
        // Ganti .replece menjadi .replace
        const cleanName = fullName.replace(/\s+/g, ' ').toLowerCase();

        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const defaultUsername = `${cleanName}${randomSuffix}`;

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                full_name: fullName,
                email,
                password: hashedPassword,
                role: 'USER',
                profile: {
                    create: {
                        username: defaultUsername
                    }
                }
            },

            select: {
                id: true,
                email: true,
                full_name: true,
                profile: { 
                    select : { username: true }
                }
            }
        });

        await this.activityLogService.log(
            newUser.id,
            ActivityAction.REGISTER,
            `User registered with email: ${email}`
        );

        return newUser
    }
    
    
    
    async loginUser(data: any) {
        const { email, password } = data;

        // 1. Cek User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Email atau password salah");
        }

        // 2. Cek Password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Email atau password salah");
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'super_secret_key',
            { expiresIn: '1d' }
        )

        await this.activityLogService.log(
            user.id,
            ActivityAction.LOGIN,
            "User logged in successfully"
        );

        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        };
    }

}

