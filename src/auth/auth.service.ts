import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {UserService} from "../user/user.service";

const userService = new UserService();
const JWT_SECRET = process.env.SECRET_KEY;

export class AuthService {
    async register(email: string, password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userService.createUser(email, hashedPassword);
        return this.generateToken(user.id);
    }

    async login(email: string, password: string): Promise<string> {
        const user: {id: number, email: string, createdAt: Date, password: string} | null = await userService.getUserByEmail(email);
        if (!user) throw new Error('User not found');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid credentials');

        return this.generateToken(user.id);
    }

    private generateToken(userId: number): string {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    }
}
