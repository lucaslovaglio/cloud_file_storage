import express, { Request, Response } from 'express';
import authRoutes from './auth/auth.routes';
import permissionRoutes from "./permission/permission.routes";
import roleRoutes from "./role/role.routes";


const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Cloud File Storage!');
});


app.use('/auth', authRoutes);
app.use('/permission', permissionRoutes);
app.use('/role', roleRoutes);


export default app