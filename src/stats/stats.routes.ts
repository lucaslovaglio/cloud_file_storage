import express from 'express';
import {AuthMiddleware} from "../auth/auth.middleware";
import {StatsController} from "./stats.controller";

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Operaciones relacionadas con las estadísticas.
 */


const router = express.Router();
const statsController = new StatsController();

router.use(AuthMiddleware);


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
 * /stats:
 *   get:
 *     summary: Returns the stats with detailed user storage information
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response containing the stats with users' storage details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-04T03:00:00.000Z"
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       userName:
 *                         type: string
 *                         example: "user@example.com"
 *                       storageUsed:
 *                         type: integer
 *                         example: 0
 *       403:
 *         description: Unauthorized, only admins can access this resource.
 *       500:
 *         description: Server Error.
 */

router.get('/', statsController.getStats.bind(statsController));



export default router;
