import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllAdmin = catchAsync(async(req, res , next) => {

    const query = req.query;
   const result = await AdminService.getAllAdminFromDB(query);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "All admin are retrieved successfully",
        data: result
    })

})

const getSingleaAdmin = catchAsync(async(req, res , next) => {
    const {admin_Id} = req.params;
    const result = await AdminService.getSingleAdminFromDB(admin_Id);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Targeted admin are retrieved successfully",
        data: result
    })

})

const deleteAdminAndUser = catchAsync(async(req, res) => {
    const {admin_Id} = req.params;
    const result = await AdminService.deleteAdminAndUserFromDB(admin_Id);

    sendResponse(res , {
        statusCode: status.OK,
        success: true,
        message: "Admin and user has been successfully deleted",
        data: result
    })
})

export const AdminControllers = {
    getAllAdmin,
    getSingleaAdmin,
    deleteAdminAndUser,
}