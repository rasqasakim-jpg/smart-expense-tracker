import fs from 'fs';
import path from 'path';
import prisma from '../database';
import { RelationshipStatus } from '../generated/client'; 

export class UserService {



  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        full_name: true,
        profile: {
          select: {
            username: true,
            address: true,
            occupation: true,
            date_of_birth: true,
            relationship: true,
            avatar: true 
          }
        },
        wallets: true 
      }
    });

    if (!user) throw new Error("User tidak ditemukan");

    return user;
  }


  async updateProfile(
    userId: string, 
    data: { 
      fullName?: string; 
      username?: string; 
      address?: string; 
      dateOfBirth?: string; 
      occupation?: string;
      relationship?: RelationshipStatus; 
      avatar?: string; // Path file baru dari multer
    }
  ) {
    // 1. Ambil data user lama untuk cek foto lama & validasi username
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { profile: true } 
    });
    
    if (!user) throw new Error("User tidak ditemukan");

    // Simpan path foto lama untuk dihapus nanti
    const oldAvatarPath = user.profile?.avatar;

    // 2. Validasi Username (Hanya jika username diubah)
    if (data.username && user.profile?.username !== data.username) {
        const checkUsername = await prisma.profile.findUnique({
            where: { username: data.username }
        });
        if (checkUsername) throw new Error("Username sudah digunakan orang lain");
    }

    // 3. Eksekusi Update ke Database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName && { full_name: data.fullName }),
        profile: {
          update: { 
             ...(data.username && { username: data.username }),
             ...(data.address && { address: data.address }),
             ...(data.occupation && { occupation: data.occupation }),
             ...(data.dateOfBirth && { date_of_birth: new Date(data.dateOfBirth) }),
             ...(data.relationship && { relationship: data.relationship }),
             ...(data.avatar && { avatar: data.avatar }), // Simpan path foto baru
          }
        }
      },
      select: {
        id: true,
        full_name: true,
        profile: true 
      }
    });

    // 4. LOGIKA HAPUS FOTO LAMA (Otomatis)
    // Jika update berhasil DAN user upload foto baru DAN ada foto lama
    if (data.avatar && oldAvatarPath) {
      // Gunakan path.resolve agar aman di Ubuntu/Linux
      const fullPath = path.resolve(oldAvatarPath);
      
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Storage] Foto lama dihapus: ${oldAvatarPath}`);
          }
        } catch (err) {
          console.error(`[Storage] Gagal menghapus file lama: ${err}`);
        }
      }
    }

    return updatedUser;
  }
}