import prisma from '../database';
// 👇 1. Import Enum dari Prisma Client
import { RelationshipStatus } from '../generated/client'; 
// (Atau '@prisma/client' tergantung settingan generate kamu)

export class UserService {
  async updateProfile(
    userId: string, 
    data: { 
      fullName?: string; 
      username?: string; 
      address?: string; 
      dateOfBirth?: string; 
      occupation?: string;
      // 👇 2. Tambahkan tipe data untuk relationship
      relationship?: RelationshipStatus; 
    }
  ) {
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { profile: true } 
    });
    
    if (!user) throw new Error("User tidak ditemukan");

    if (data.username && user.profile?.username !== data.username) {
        const checkUsername = await prisma.profile.findUnique({
            where: { username: data.username }
        });
        if (checkUsername) throw new Error("Username sudah digunakan orang lain");
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName && { full_name: data.fullName }),
        profile: {
          update: { 
             ...(data.username && { username: data.username }),
             ...(data.address && { address: data.address }),
             ...(data.occupation && { occupation: data.occupation }),
             ...(data.dateOfBirth && { date_of_birth: new Date(data.dateOfBirth) }),
             // 👇 3. Tambahkan logika update relationship
             ...(data.relationship && { relationship: data.relationship }),
          }
        }
      },
      select: {
        id: true,
        full_name: true,
        profile: true 
      }
    });
  }
}