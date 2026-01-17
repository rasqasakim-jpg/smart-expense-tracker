import dotenv from 'dotenv';
dotenv.config();
// Validate essential env vars and guide developer when missing
const missingVars = [];
if (!process.env.DATABASE_URL)
    missingVars.push('DATABASE_URL');
if (!process.env.JWT_SECRET)
    missingVars.push('JWT_SECRET (recommended)');
if (missingVars.length) {
    console.warn(`\n[env] Missing environment variables: ${missingVars.join(', ')}.\n` +
        `Please copy ".env.example" to ".env" and set the required values.\n`);
}
export const config = {
    // Bind to all interfaces by default so devices on the same network can reach the server
    HOST: process.env.HOST || '0.0.0.0',
    PORT: Number(process.env.PORT) || 5000, // Diubah ke Number agar tidak error di app.listen
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret_key',
};
if (process.env.HOST === 'localhost') {
    console.warn('[env] Note: HOST is set to localhost — the server may not be reachable from other devices on the network. Use 0.0.0.0 or your machine IP if testing from a physical device.');
}
export default config;
//# sourceMappingURL=env.js.map