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
        // Tetap pakai model 2.5 Flash
        this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    // ==========================================
    // 1. FITUR INSIGHT (Gaya: Smart Casual & Sopan)
    // ==========================================
    async analyzeFinancialHealth(data: {
        userName: string;
        userOccupation: string;
        userRelationship: string;
        totalIncome: number;
        totalExpense: number;
        budgetLimit: number;
        topCategories: string[];
    }) {
        const remaining = data.budgetLimit - data.totalExpense;
        const usagePercent = data.budgetLimit > 0
            ? Math.round((data.totalExpense / data.budgetLimit) * 100)
            : 0;

        // 👇 PROMPT BARU: "Smart Casual" (Santai, Sopan, Profesional)
        const prompt = `
      Peran: Financial Advisor Pribadi yang Ramah, Cerdas, dan Profesional.
      Tone: "Smart Casual" (Gunakan Bahasa Indonesia yang baku dan sopan, tapi mengalir santai, hangat, dan tidak kaku seperti robot).

      DATA PENGGUNA:
      - Nama: ${data.userName}
      - Pekerjaan: ${data.userOccupation}
      - Status: ${data.userRelationship}
      
      DATA KEUANGAN BULAN INI:
      - Pemasukan: Rp ${data.totalIncome.toLocaleString('id-ID')}
      - Pengeluaran: Rp ${data.totalExpense.toLocaleString('id-ID')}
      - Budget: Rp ${data.budgetLimit.toLocaleString('id-ID')}
      - Sisa: Rp ${remaining.toLocaleString('id-ID')} (${usagePercent}% terpakai)
      - Top Pengeluaran: ${data.topCategories.join(', ')}

      PANDUAN SARAN (Sesuaikan dengan Profil):
      1. Jika "STUDENT/SINGLE": Berikan semangat untuk investasi skill atau menabung gadget, dengan bahasa yang memotivasi anak muda.
      2. Jika "MARRIED": Gunakan bahasa yang lebih dewasa, fokus pada kestabilan keluarga.
      3. Kaitkan saran dengan pekerjaan mereka (misal IT, Bisnis, dll) jika relevan.

      TUGAS:
      Berikan output HANYA JSON.
      {
        "score": number (0-100),
        "status": "AMAN" | "WASPADA" | "BAHAYA",
        "message": "string (Komentar 2-3 kalimat. Sapa pengguna dengan namanya. Gunakan bahasa yang hangat dan apresiatif)",
        "tips": ["string", "string", "string"] (3 tips praktis, singkat, dan jelas)
      }
    `;

        try {
            console.log("📡 [Gemini] Mengirim request insight (Smart Casual)...");

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Logic pembersih JSON
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');

            if (firstBrace === -1 || lastBrace === -1) {
                throw new Error("Format JSON tidak ditemukan.");
            }

            const cleanJson = text.substring(firstBrace, lastBrace + 1);
            return JSON.parse(cleanJson);

        } catch (error: any) {
            console.error("\n❌ GEMINI ERROR:", error);
            
            return {
                score: 0,
                status: "ERROR",
                message: "Maaf, asisten keuangan sedang istirahat sebentar. Silakan coba lagi nanti ya.",
                tips: []
            };
        }
    }

    // ==========================================
    // 2. FITUR CHATBOT (Gaya: Ramah & Membantu)
    // ==========================================
    async chatWithFinancialBot(
        contextData: string, 
        userQuestion: string, 
        userOccupation: string,
        userRelationship: string
    ) {
        const prompt = `
      Peran: Asisten Keuangan Virtual yang Ramah dan Pintar.
      Tone: Sopan, Santai, tapi tetap Profesional (seperti Customer Service premium atau Teller Bank yang ramah).
      
      KONTEKS PENGGUNA:
      - Pekerjaan: ${userOccupation}
      - Status: ${userRelationship}

      DATA KEUANGAN:
      ${contextData}

      PERTANYAAN: "${userQuestion}"

      INSTRUKSI JAWABAN:
      1. Jawablah dengan bahasa Indonesia yang baik, mengalir, dan nyaman dibaca.
      2. Jangan gunakan bahasa gaul kasar (hindari: lu/gw, anjay, dsb).
      3. Gunakan kata sapaan "Anda" atau sebut nama jika perlu.
      4. Berikan jawaban yang solutif berdasarkan data di atas.
      5. Jawablah secara ringkas dan padat.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            return "Mohon maaf, koneksi saya sedang tidak stabil. Boleh diulangi pertanyaannya?";
        }
    }
}