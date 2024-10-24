import express from 'express';
import {RoleController} from "./role.controller";

const router = express.Router();
const roleController = new RoleController()

router.post('/', roleController.createRole.bind(roleController));
router.get('/:id', roleController.getRoleById.bind(roleController));
router.delete('/:id', roleController.deleteRole.bind(roleController));
router.post('/assign', roleController.assignRoleToUser.bind(roleController));
router.get('/:id/permissions', roleController.getRolePermissions.bind(roleController));


export default router;
