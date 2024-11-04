import request from 'supertest';
import app from '../src/app';  // Asegúrate de exportar tu app de Express

describe('GET /', () => {
    it('should respond with "Hello, Cloud File Storage!"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, Cloud File Storage!');
    });
});