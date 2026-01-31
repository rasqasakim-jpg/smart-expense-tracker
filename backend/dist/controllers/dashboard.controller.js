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
        const { month, year } = req.query;
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            // Penting: Log query mentah untuk cek apa yang dikirim frontend.
            // Apakah month="1" atau month="01"? Debugging tanggal sering tricky.
            console.log("[dashboard] getStats called from", req.ip || req.hostname, "userId:", userId, "query:", req.query);
        }
        const data = await this.service.getDashboardData(userId, month ? Number(month) : undefined, year ? Number(year) : undefined);
        // --- LOG END ---
        if (process.env.NODE_ENV === "development") {
            // Dashboard data biasanya objek besar (nested JSON). 
            // Jangan di-log isinya (data), cukup konfirmasi bahwa proses selesai.
            try {
                const targetDate = month && year ? `${month}/${year}` : "All Time";
                console.log(`[dashboard] stats retrieved for userId=${userId} period=${targetDate}`);
            }
            catch (_) { }
        }
        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data: data
        });
    });
}
//# sourceMappingURL=dashboard.controller.js.map
