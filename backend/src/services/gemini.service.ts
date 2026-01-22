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
        // Pastikan model ini benar. Kadang 'gemini-pro' lebih stabil kalau flash error.
        this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    async analyzeFinancialHealth(data: {
        userName: string;
        totalIncome: number;
        totalExpense: number;
        budgetLimit: number;
        topCategories: string[];
    }) {
        const remaining = data.budgetLimit - data.totalExpense;
        const usagePercent = data.budgetLimit > 0
            ? Math.round((data.totalExpense / data.budgetLimit) * 100)
            : 0;

        const prompt = `
      Bertindaklah sebagai "Financial Bestie" (Konsultan Keuangan) yang santai tapi bijak untuk user: ${data.userName}.
      
      DATA:
      - Pemasukan: Rp ${data.totalIncome.toLocaleString('id-ID')}
      - Pengeluaran: Rp ${data.totalExpense.toLocaleString('id-ID')}
      - Budget: Rp ${data.budgetLimit.toLocaleString('id-ID')}
      - Sisa Budget: Rp ${remaining.toLocaleString('id-ID')} (${usagePercent}% terpakai)
      - Top Boros: ${data.topCategories.join(', ')}

      TUGAS:
      Analisa data di atas. Berikan output format JSON saja (tanpa markdown).
      {
        "score": number (0-100),
        "status": "AMAN" | "WASPADA" | "BAHAYA",
        "message": "string (komentar 1-2 kalimat bahasa gaul sopan)",
        "tips": ["string", "string", "string"] (3 tips praktis)
      }
    `;

        try {
            // Debugging: Cek apakah request terkirim
            if (process.env.NODE_ENV === 'development') {
                console.log("[Gemini] Sending prompt...");
            }

            const result = await this.model.generateContent(prompt);
            const response = await result.response; // Tunggu response full
            const text = response.text();
            
            // 🔥 PERBAIKAN DI SINI: .replace (bukan replase)
            const cleanText = text.replace(/```json|```/g, "").trim();
            
            return JSON.parse(cleanText);

        } catch (error: any) {
            // 🔥 LOGGING LEBIH JELAS
            console.error("\n❌ GEMINI ERROR DETAILS:");
            if (error.response) {
                console.error(JSON.stringify(error.response, null, 2));
            } else {
                console.error(error); // Print error aslinya (termasuk kalau ada typo)
            }
            
            // Tidak perlu throw, cukup return fallback di bawah
        }

        // Return Default kalau Error
        return {
            score: 0,
            status: "ERROR",
            message: "Asisten sedang sibuk, coba lagi nanti ya!",
            tips: []
        };
    }
}