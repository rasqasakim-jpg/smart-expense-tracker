import { UserService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class UserController {
    userService;
    constructor() {
        this.userService = new UserService();
    }
    updateProfile = asyncHandler(async (req, res) => {
        // Syntax A
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        // Masuk ke service aman tanpa tanda seru
        const updatedUser = await this.userService.updateProfile(userId, req.body);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: updatedUser
        });
    });
}
//# sourceMappingURL=user.controller.js.map
