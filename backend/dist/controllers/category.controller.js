import { CategoryService } from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class CategoryController {
    categotyService;
    constructor() {
        this.categotyService = new CategoryService();
    }
    getAll = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { type } = req.query;
        const categories = await this.categotyService.getCatagories(userId, type);
        res.status(200).json({
            success: true,
            message: "Operation",
            data: categories
        });
    });
    create = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const newCategory = await this.categotyService.createCategory(userId, req.body);
        res.status(201).json({
            success: true,
            message: "Opration success",
            data: newCategory
        });
    });
}
//# sourceMappingURL=category.controller.js.map
