import request from 'supertest';
import app from '../app';

describe('StorageController', () => {
    let uploaderToken: string;
    let downloaderToken: string;
    const testFile = Buffer.from("Este es un archivo de prueba");
    const testFileName = "archivo_prueba11.txt";
    let downloaderId: number;

    beforeAll(async () => {
        // Login para el usuario que subirá el archivo
        const uploaderLogin = await request(app)
            .post('/auth/login')
            .send({ email: 'maria@gmail.com', password: '12345678' });
        uploaderToken = uploaderLogin.body.token;

        // Login para el usuario que intentará descargar el archivo
        const downloaderLogin = await request(app)
            .post('/auth/login')
            .send({ email: 'lucas@gmail.com', password: '12345678' });
        downloaderToken = downloaderLogin.body.token;
        downloaderId = 3;
    });

    it('should upload a file successfully by the uploader user', async () => {
        const response = await request(app)
            .post('/storage/upload')
            .set('Authorization', `Bearer ${uploaderToken}`)
            .attach('file', testFile, testFileName);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Archivo subido correctamente" });
    }, 300000);

    it('should not allow downloader to download the file without sharing', async () => {
        const response = await request(app)
            .get(`/storage/file/${testFileName}`)
            .set('Authorization', `Bearer ${downloaderToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error al solicitar el link de descarga: No tiene permisos para leer este archivo' });
    });

    it('should allow downloader to download the file after sharing', async () => {
        // Compartir el archivo con el downloader
        const r1 = await request(app)
            .post(`/storage/share`)
            .set('Authorization', `Bearer ${uploaderToken}`)
            .send({ fileName: testFileName, targetUserId: downloaderId });

        // Intentar descargar el archivo compartido
        const response = await request(app)
            .get(`/storage/file/${testFileName}`)
            .set('Authorization', `Bearer ${downloaderToken}`);

        expect(response.status).toBe(200);
        expect(response.body.fileUrl).toBeDefined(); // Suponiendo que el URL del archivo se retorna aquí
    });

    it('should not allow downloader to download the file after unsharing', async () => {
        // Dejar de compartir el archivo con el downloader
        const r1 = await request(app)
            .post(`/storage/unshare`)
            .set('Authorization', `Bearer ${uploaderToken}`)
            .send({ fileName: testFileName, targetUserId: downloaderId });

        // Intentar descargar el archivo después de descompartir
        const response = await request(app)
            .get(`/storage/file/${testFileName}`)
            .set('Authorization', `Bearer ${downloaderToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error al solicitar el link de descarga: No tiene permisos para leer este archivo' });
    });
});
