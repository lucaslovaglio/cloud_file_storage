import request from 'supertest';
import app from '../app';

describe('StatsController', () => {
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
        const adminLoginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'admin@gmail.com', password: '12345678' });
        adminToken = adminLoginResponse.body.token;

        const userLoginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'maria@gmail.com', password: '12345678' });
        userToken = userLoginResponse.body.token;
    });

    it('should return stats for admin user', async () => {
        const response = await request(app)
            .get('/stats')  // Ruta del endpoint de stats
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('should return 403 for non-admin user', async () => {
        const response = await request(app)
            .get('/stats')  // Ruta del endpoint de stats
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: 'Unauthorized' });
    });
});
