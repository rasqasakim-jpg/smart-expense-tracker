import prisma from "../database.js";
export class UserService {
    // Tipe data langsung didefinisikan di dalam kurung parameter (Inline)
    async updateProfile(userId, data) {
        // 1. Cek User exist & include profile untuk validasi username
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        });
        if (!user)
            throw new Error("User tidak ditemukan");
        // 2. Validasi Unik Username (Hanya jika user mengirim username baru)
        if (data.username && user.profile?.username !== data.username) {
            const checkUsername = await prisma.profile.findUnique({
                where: { username: data.username }
            });
            if (checkUsername)
                throw new Error("Username sudah digunakan orang lain");
        }
        // 3. Eksekusi Update
        return await prisma.user.update({
            where: { id: userId },
            data: {
                // A. Update Full Name (di Table User)
                ...(data.fullName && { full_name: data.fullName }),
                // B. Update Profile (di Table Profile)
                profile: {
                    update: {
                        ...(data.username && { username: data.username }),
                        ...(data.address && { address: data.address }),
                        ...(data.occupation && { occupation: data.occupation }),
                        // Konversi string date ke Object Date
                        ...(data.dateOfBirth && { date_of_birth: new Date(data.dateOfBirth) }),
                    }
                }
            },
            select: {
                id: true,
                full_name: true,
                email: true,
                profile: true // Return data profile terbaru
            }
        });
    }
}
//# sourceMappingURL=user.service.js.map
