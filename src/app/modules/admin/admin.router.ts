import express from 'express' ;
import { AdminControllers } from './admin.controller';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmin);
router.get('/:admin_Id', AdminControllers.getSingleaAdmin);
router.delete('/:admin_Id', AdminControllers.deleteAdminAndUser);

export const AdminRouter = router;