import express from 'express';
import {UserController} from "./user.controller";
import {AuthMiddleware} from "../auth/auth.middleware";
import { validateData } from "../data-validation/data-validation.middleware";
import { createUserSchema } from "./user.schema";

const router = express.Router();
const userController = new UserController()

router.use(AuthMiddleware);

router.post('/', validateData(createUserSchema), userController.createUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.get('/all', userController.getUsers.bind(userController));
router.get('/:id/roles', userController.getUserRoles.bind(userController));


export default router;
