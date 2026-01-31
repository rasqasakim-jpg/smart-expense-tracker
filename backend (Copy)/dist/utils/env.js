import dotenv from 'dotenv';
dotenv.config();
export const config = {
    HOST: process.env.HOST || 'localhost',
    PORT: Number(process.env.PORT) || 5000, // Diubah ke Number agar tidak error di app.listen
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "123456",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
};
export default config;
//# sourceMappingURL=env.js.map