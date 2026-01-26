import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export class GeminiService {
    private model: any;

    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY tidak ditemukan di .env");
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Menggunakan model Flash agar respon cepat dan hemat
        this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    // ==========================================
    // 1. FITUR INSIGHT (Analisa Keuangan Bulanan)
    // ==========================================
    async analyzeFinancialHealth(data: {
        userName: string;
        userOccupation: string;     // 👈 Parameter Baru: Pekerjaan
        userRelationship: string;   // 👈 Parameter Baru: Status Hubungan
        totalIncome: number;
        totalExpense: number;
        budgetLimit: number;
        topCategories: string[];
    }) {
        const remaining = data.budgetLimit - data.totalExpense;
        const usagePercent = data.budgetLimit > 0
            ? Math.round((data.totalExpense / data.budgetLimit) * 100)
            : 0;

        // Prompt dimodifikasi agar AI sadar status user
        const prompt = `
      Bertindaklah sebagai "Financial Bestie" (Konsultan Keuangan) yang santai tapi bijak.
      
      PROFIL USER:
      - Nama: ${data.userName}
      - Pekerjaan: ${data.userOccupation}
      - Status Hubungan: ${data.userRelationship} (PENTING! Sesuaikan konteks saranmu dengan status ini)

      DATA KEUANGAN:
      - Pemasukan: Rp ${data.totalIncome.toLocaleString('id-ID')}
      - Pengeluaran: Rp ${data.totalExpense.toLocaleString('id-ID')}
      - Budget: Rp ${data.budgetLimit.toLocaleString('id-ID')}
      - Sisa Budget: Rp ${remaining.toLocaleString('id-ID')} (${usagePercent}% terpakai)
      - Top Boros: ${data.topCategories.join(', ')}

      PANDUAN SARAN BERDASARKAN STATUS:
      - Jika "SINGLE" (Lajang): Fokus ke nabung gadget, travel, self-reward, atau investasi awal.
      - Jika "MARRIED" (Menikah): Fokus ke kebutuhan rumah tangga, diskusi dengan pasangan.
      - Jika "MARRIED_WITH_KIDS" (Punya Anak): Fokus ke dana pendidikan, susu/popok, dan dana darurat keluarga.
      - Jika "STUDENT" (Mahasiswa/Pelajar): Fokus ke hemat uang saku dan cari diskonan.

      TUGAS:
      Analisa data di atas. Berikan output format JSON saja (tanpa markdown).
      {
        "score": number (0-100),
        "status": "AMAN" | "WASPADA" | "BAHAYA",
        "message": "string (komentar 1-2 kalimat bahasa gaul sopan sesuai status user)",
        "tips": ["string", "string", "string"] (3 tips praktis yang relevan)
      }
    `;

        try {
            if (process.env.NODE_ENV === 'development') {
                console.log("[Gemini] Sending insight prompt...");
            }

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Bersihkan markdown JSON
            const cleanText = text.replace(/```json|```/g, "").trim();

            return JSON.parse(cleanText);

        } catch (error: any) {
            console.error("\n❌ GEMINI ERROR DETAILS:", error);
            
            // Return Default kalau Error
            return {
                score: 0,
                status: "ERROR",
                message: "Asisten sedang sibuk, coba lagi nanti ya!",
                tips: []
            };
        }
    }


    // ==========================================
    // 2. FITUR CHATBOT (Tanya Jawab)
    // ==========================================
    async chatWithFinancialBot(
        contextData: string, 
        userQuestion: string, 
        userOccupation: string,   // 👈 Parameter Baru
        userRelationship: string  // 👈 Parameter Baru
    ) {
        // Prompt Chatbot dengan Persona
        const prompt = `
      Bertindaklah sebagai "Financial Assistant" pribadi yang pintar, ramah, dan gaul.
      
      PROFIL USER YANG KAMU BANTU:
      - Pekerjaan: ${userOccupation}
      - Status Keluarga: ${userRelationship}
      (Sesuaikan gaya bahasa dan saranmu dengan profil user ini).

      DATA KEUANGAN USER (Fakta Mutlak):
      ${contextData}

      ATURAN:
      1. Jawab pertanyaan user BERDASARKAN data di atas.
      2. Jangan halusinasi data yang tidak ada.
      3. Berikan jawaban yang singkat, padat, dan solutif.
      4. Gunakan gaya bahasa santai tapi sopan.

      PERTANYAAN USER: "${userQuestion}"
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text(); // Return string biasa (teks jawaban)
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            return "Waduh, aku lagi pusing nih (Error koneksi AI). Tanya lagi nanti ya!";
        }
    }
}