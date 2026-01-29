import type { Request, Response } from 'express';
import { AiService } from '../services/ai.service';
import { asyncHandler } from '../utils/asyncHandler';

export class AiController {
  private aiService: AiService;

  constructor() {
    this.aiService = new AiService();
  }

  // Method GET /api/ai/insight
  public getInsight = asyncHandler(async (req: Request, res: Response) => {
    // 1. Ambil User ID dari Token (hasil decode AuthMiddleware)
    const userId = req.user?.id;
    
    if (!userId) {
        // Sebenarnya ini biasanya sudah dicegat middleware, tapi double check
        const error: any = new Error("Unauthorized");
        error.status = 401;
        throw error;
    }

    // 2. Logging Development (Biar enak debug di terminal)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AI] Insight request from IP=${req.ip} userId=${userId}`);
    }

    // 3. Panggil Service Utama
    // Controller gak perlu tau soal Gemini/Prisma, dia cuma tau "Minta Insight"
    const data = await this.aiService.getFinancialInsight(userId);

    if (process.env.NODE_ENV === 'development') {
        console.log(`[AI] Insight generated successfully for userId=${userId}`);
    }

    // 4. Kirim Response Standard JSON
    res.status(200).json({
      success: true,
      message: "AI Financial Insight retrieved successfully",
      data: data
    });
  });


  public chatWithBot = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { message } = req.body; // Ambil pesan user dari body

    if (!userId) throw new Error("Unauthorized");
    if (!message) throw new Error("Message is required");

    // Panggil Service
    const reply = await this.aiService.chatWithAi(userId, message);

    res.status(200).json({
      success: true,
      data: {
        reply: reply // Jawaban dari AI
      }
    });
  });
}