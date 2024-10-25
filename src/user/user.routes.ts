import express from 'express';
import {UserController} from "./user.controller";

const router = express.Router();
const userController = new UserController()

router.post('/', userController.createUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.post('/all', userController.getUsers.bind(userController));
router.get('/:id/roles', userController.getUserRoles.bind(userController));


export default router;
