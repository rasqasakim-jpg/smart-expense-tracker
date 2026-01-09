import { UserService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class UserController {
    userService;
    constructor() {
        this.userService = new UserService();
    }
    updateProfile = asyncHandler(async (req, res) => {
        // Langsung lempar req.user.id dan req.body ke Service.
        // Tanda seru (!) artinya kita yakin req.user ADA (dijamin middleware).
        const updatedUser = await this.userService.updateProfile(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: updatedUser
        });
    });
}
//# sourceMappingURL=user.controller.js.map
