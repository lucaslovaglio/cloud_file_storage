import express from 'express';
import {UserController} from "./user.controller";
import {AuthMiddleware} from "../auth/auth.middleware";

const router = express.Router();
const userController = new UserController()

router.use(AuthMiddleware);

router.post('/', userController.createUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.get('/all', userController.getUsers.bind(userController));
router.get('/:id/roles', userController.getUserRoles.bind(userController));


export default router;
