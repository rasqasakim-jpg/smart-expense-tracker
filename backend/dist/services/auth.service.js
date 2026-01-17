import prisma from "../database.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/hash.js";
export class AuthService {
    async registerUser(data) {
        const { fullName, email, password } = data;
        // Validasi manual jika data kosong (safety net)
        if (!fullName || !email || !password) {
            throw new Error("Full name, email, and password are required");
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email sudah terdaftar");
        }
        // --- PERBAIKAN DI SINI ---
        // Ganti .replece menjadi .replace
        const cleanName = fullName.replace(/\s+/g, " ").toLowerCase();
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const defaultUsername = `${cleanName}${randomSuffix}`;
        const hashedPassword = await hashPassword(password);
        // Safety check: ensure hashing actually changed the value
        if (!hashedPassword || hashedPassword === password) {
            const error = new Error("Failed to hash password");
            error.status = 500;
            throw error;
        }
        const created = await prisma.user.create({
            data: {
                full_name: fullName,
                email,
                password: hashedPassword,
                role: "USER",
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
                    select: { username: true }
                }
            }
        });
        // In development, include a short debug log (do not expose plaintext password)
        if (process.env.NODE_ENV === "development") {
            // Log the hashed password (safe to expose for debugging) instead of the raw input
            console.log(`User created: ${created.email} (id: ${created.id}) hashed: ${hashedPassword}`);
        }
        return created;
    }
    async loginUser(data) {
        const { email, password } = data;
        // 1. Cek User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Email atau password salah");
        }
        // Debug logs in development to help track down mismatches
        if (process.env.NODE_ENV === "development") {
            try {
                console.log(`loginUser: attempting login for email=${email}`);
                console.log(`Stored hash length=${user.password?.length ?? 0}, prefix=${String(user.password).slice(0, 6)}`);
                // For debugging, log the full stored hashed password (will never be the raw password)
                console.log(`Stored hash=${user.password}`);
            }
            catch (_) {
                // ignore logging errors
            }
        }
        // 2. Cek Password
        const isPasswordValid = await comparePassword(password, user.password);
        if (process.env.NODE_ENV === "development") {
            console.log(`Password valid: ${isPasswordValid}`);
        }
        if (!isPasswordValid) {
            throw new Error("Email atau password salah");
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET || "super_secret_key", { expiresIn: "1d" });
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
//# sourceMappingURL=auth.service.js.map
