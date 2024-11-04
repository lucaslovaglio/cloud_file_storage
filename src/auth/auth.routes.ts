import express from 'express';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema} from "./auth.schema";
import { validateData } from "../data-validation/data-validation.middleware";

const router = express.Router();
const authController = new AuthController();

router.post('/register', validateData(registerSchema), authController.register.bind(authController));
router.post('/login', validateData(loginSchema), authController.login.bind(authController));

export default router;


/**
 * @swagger
 * tags:
 *   - name: "Auth"
 *     description: "Operaciones relacionadas con autenticación de usuarios"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: "Registrar un nuevo usuario"
 *     tags: ["Auth"]
 *     description: "Registra un nuevo usuario proporcionando su email y contraseña. Devuelve un token de autenticación si el registro es exitoso."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Correo electrónico del usuario"
 *                 example: "usuario@ejemplo.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: "Contraseña del usuario (mínimo 8 caracteres)"
 *                 example: "contraseñaSegura123"
 *     responses:
 *       200:
 *         description: "Registro exitoso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "Token JWT para autenticación"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       500:
 *         description: "Error interno del servidor"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al registrar usuario"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: "Inicio de sesión de usuario"
 *     tags: ["Auth"]
 *     description: "Permite al usuario iniciar sesión proporcionando email y contraseña válidos. Devuelve un token de autenticación si las credenciales son correctas."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Correo electrónico del usuario"
 *                 example: "usuario@ejemplo.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: "Contraseña del usuario (mínimo 8 caracteres)"
 *                 example: "contraseñaSegura123"
 *     responses:
 *       200:
 *         description: "Inicio de sesión exitoso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "Token JWT para autenticación"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       500:
 *         description: "Error interno del servidor"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al iniciar sesión"
 */