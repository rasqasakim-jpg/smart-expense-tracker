import { CategoryService } from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class CategoryController {
    categoryService;
    constructor() {
        this.categoryService = new CategoryService();
    }
    getAll = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { type } = req.query;
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            // Perhatikan: Di sini kita log 'query', bukan 'body'
            console.log("[category] getAll called from", req.ip || req.hostname, "userId:", userId, "query:", req.query);
        }
        const categories = await this.categoryService.getCategories(userId, type);
        // --- LOG END ---
        if (process.env.NODE_ENV === "development") {
            // Kita log jumlah data yang didapat, biar tahu filternya jalan atau tidak
            console.log(`[category] getAll returned ${categories.length} items for userId=${userId}`);
        }
        res.status(200).json({
            success: true,
            message: "Operation success", // Fixed typo "Operation"
            data: categories
        });
    });
    create = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            console.log("[category] create called from", req.ip || req.hostname, "userId:", userId, "body:", req.body);
        }
        const newCategory = await this.categoryService.createCategory(userId, req.body);
        // --- LOG END ---
        if (process.env.NODE_ENV === "development") {
            try {
                console.log(`[category] created id=${newCategory.id} name=${newCategory.name} userId=${userId}`);
            }
            catch (_) { }
        }
        res.status(201).json({
            success: true,
            message: "Operation success", // Fixed typo "Opration success"
            data: newCategory
        });
    });
}
//# sourceMappingURL=category.controller.js.map
