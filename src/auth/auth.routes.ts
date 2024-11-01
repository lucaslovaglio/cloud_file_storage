import express from 'express';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema} from "./auth.schema";
import { validateData } from "../data-validation/data-validation.middleware";

const router = express.Router();
const authController = new AuthController();

router.post('/register', validateData(registerSchema), authController.register.bind(authController));
router.post('/login', validateData(loginSchema), authController.login.bind(authController));

export default router;
