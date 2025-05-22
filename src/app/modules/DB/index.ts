import config from "../../config";
import { USER_ROLE } from "../user/user.constant";
import { User } from "../user/user.schemaAndModel";

const superAdmin = {
    id: '0001',
    email: '15.027.akhter@gmial.com',
    password: config.super_admin_pass,
    needsPasswordChange: false,
    role: USER_ROLE.superAdmin,
    status: 'in-progress',
    isDeleted: false,
};
export const seedSuperAdmin = async() => {
    //when database will connected, it check is there any user who is super admin
    const isSuperAdminExists = await User.findOne({role: USER_ROLE.superAdmin});
    if(!isSuperAdminExists){
        await User.create(superAdmin);
    }
}
