import { DashboardService } from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class DashboardController {
    service;
    constructor() {
        this.service = new DashboardService();
    }
    getStats = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        // Ambil filter dari query params (opsional)
        // Contoh URL: /api/dashboard?month=1&year=2026
        const { month, year } = req.query;
        const data = await this.service.getDashboardData(userId, month ? Number(month) : undefined, year ? Number(year) : undefined);
        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data: data
        });
    });
}
//# sourceMappingURL=dashboard.controller.js.map
