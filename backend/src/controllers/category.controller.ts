import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { asyncHandler } from "../utils/asyncHandler";


export class CategoryController {
    private categotyService: CategoryService;

    constructor() {
        this.categotyService = new CategoryService();
    }

    public getAll = asyncHandler(async (req: Request, res: Response) =>{
        const userId = req.user?.id;
        if(!userId) throw new Error("Unauthorized");


        const { type } = req.query;

        const categories = await this.categotyService.getCatagories(
            userId,
            type as string | undefined
        );

        res.status(200).json({
            success: true,
            message: "Operation",
            data: categories
        })
    })

    public create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const newCategory = await this.categotyService.createCategory(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Opration success",
            data: newCategory
        })
    })
}