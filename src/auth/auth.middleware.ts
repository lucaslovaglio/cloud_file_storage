import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY;

export const AuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log('Token:', token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}