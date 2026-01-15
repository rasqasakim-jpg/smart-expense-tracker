import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";
import { asyncHandler } from "../utils/asyncHandler";

export class DashboardController {
    private service: DashboardService;

    constructor() {
        this.service = new DashboardService();
    }

    public getStats = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        // Ambil filter dari query params (opsional)
        // Contoh URL: /api/dashboard?month=1&year=2026
        const { month, year } = req.query;

        const data = await this.service.getDashboardData(
            userId,
            month ? Number(month) : undefined,
            year ? Number(year) : undefined
        );

        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data: data
        });
    });
}