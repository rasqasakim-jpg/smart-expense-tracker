import brcypt from 'bcrypt';
const SALT_ROUNDS = 10;
export const hashPassword = async (password) => {
    return await brcypt.hash(password, SALT_ROUNDS);
};
export const comparePassword = async (password, hash) => {
    return await brcypt.compare(password, hash);
};
//# sourceMappingURL=hash.js.map