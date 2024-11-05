import express from 'express';
import {PermissionController} from "./permission.controller";
import {AuthMiddleware} from "../auth/auth.middleware";
import { validateData } from "../data-validation/data-validation.middleware";
import { createPermissionSchema, assignPermissionToRoleSchema} from "./permission.schema";

const router = express.Router();
const permissionController = new PermissionController();

router.use(AuthMiddleware);

router.post('/', validateData(createPermissionSchema), permissionController.createPermission.bind(permissionController));
router.get('/:id', permissionController.getPermissionById.bind(permissionController));
router.delete('/:id', permissionController.deletePermission.bind(permissionController));
router.post('/assign', validateData(assignPermissionToRoleSchema), permissionController.assignPermissionToRole.bind(permissionController));

export default router;


/**
 * @swagger
 * tags:
 *   - name: "Permissions"
 *     description: "Operaciones relacionadas con los permisos."
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: "Crea un nuevo permiso"
 *     tags: ["Permissions"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermission'
 *     responses:
 *       200:
 *         description: "Permiso creado exitosamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permission created successfully"
 *                 permission:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "read_articles"
 *       500:
 *         description: "Error del servidor."
 */

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: "Obtiene un permiso por ID"
 *     tags: ["Permissions"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID del permiso"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: "Permiso encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "read_articles"
 *       500:
 *         description: "Error del servidor."
 */

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: "Elimina un permiso por ID"
 *     tags: ["Permissions"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID del permiso"
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: "Permiso eliminado exitosamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permission deleted successfully"
 *       500:
 *         description: "Error del servidor."
 */

/**
 * @swagger
 * /permissions/assign:
 *   post:
 *     summary: "Asigna un permiso a un rol"
 *     tags: ["Permissions"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignPermissionToRole'
 *     responses:
 *       200:
 *         description: "Permiso asignado al rol exitosamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permission assigned to role"
 *       500:
 *         description: "Error del servidor."
 */