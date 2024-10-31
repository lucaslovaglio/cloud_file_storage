import express from 'express';
import {AuthMiddleware} from "../auth/auth.middleware";
import {StatsController} from "./stats.controller";

const router = express.Router();
const statsController = new StatsController();

router.use(AuthMiddleware);

router.get('/', statsController.getStats.bind(statsController));



export default router;
