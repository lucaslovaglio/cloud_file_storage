import express, { Request, Response } from 'express';
import authRoutes from './auth/auth.routes';
import permissionRoutes from "./permission/permission.routes";
import roleRoutes from "./role/role.routes";
import userRoutes from "./user/user.routes";
import storageRoutes from "./cloud-storage/storage.routes";
import statsRoutes from "./stats/stats.routes";


const app = express();
const { specs, swaggerUi } = require('../swagger');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

/**
* @swagger
* /sample:
*   get:
*     summary: Returns a sample message
*     responses:
*       200:
*         description: A successful response
*/
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Cloud File Storage!');
});


app.use('/auth', authRoutes);
app.use('/permission', permissionRoutes);
app.use('/role', roleRoutes);
app.use('/user', userRoutes);
app.use('/storage', storageRoutes);
app.use('/stats', statsRoutes);


export default app