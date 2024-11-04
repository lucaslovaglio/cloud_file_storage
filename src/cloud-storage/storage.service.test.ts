import { StorageService } from './storage.service';
import { MockProvider } from './provider/providers/mock.provider'; // Mock para el proveedor de almacenamiento
import { FileData } from './storage.interface';
import AwsProvider from "./provider/providers/aws.provider";

describe('StorageService Tests', () => {
    let storageService: StorageService;
    let mockProvider: MockProvider;

    beforeEach(() => {
        mockProvider = new MockProvider();
        const awsProvider = new AwsProvider();
        mockProvider.addBackupProvider(awsProvider);
        storageService = new StorageService(mockProvider);
    });

    test('should upload file successfully', async () => {
        const file: FileData = { name: 'test.txt', content: Buffer.from('Hello World') };
        await storageService.uploadFile(file, 1); // Suponiendo que el userId es 1
        const files = await storageService.listFile(1);
        expect(files).toHaveLength(1);
        expect(files[0].name).toBe('test.txt');
    });

    test('should throw error if storage limit exceeded', async () => {
        storageService['storageLimit'] = 10; // Establece un límite bajo
        const file: FileData = { name: 'bigfile.txt', content: Buffer.alloc(15) }; // Archivo más grande que el límite

        await expect(storageService.uploadFile(file, 1)).rejects.toThrow('No hay espacio suficiente en el almacenamiento');
    });

    test('should delete a file successfully', async () => {
        const file: FileData = { name: 'test.txt', content: Buffer.from('Hello World') };
        await storageService.uploadFile(file, 1);
        await storageService.deleteFile('test.txt', 1);
        const files = await storageService.listFile(1);
        expect(files).toHaveLength(0);
    });

    test('should throw error when trying to delete file without permission', async () => {
        const file: FileData = { name: 'test.txt', content: Buffer.from('Hello World') };
        await storageService.uploadFile(file, 1);

        await expect(storageService.deleteFile('test.txt', 2)).rejects.toThrow('No tiene permisos para eliminar este archivo');
    });

    test('should return file URL for authorized user', async () => {
        const file: FileData = { name: 'test.txt', content: Buffer.from('Hello World') };
        await storageService.uploadFile(file, 1);
        const url = await storageService.getFileUrl('test.txt', 1);
        expect(url).toContain('http'); // Verifica que sea una URL válida
    });

    test('should throw error when unauthorized user tries to access file URL', async () => {
        const file: FileData = { name: 'test.txt', content: Buffer.from('Hello World') };
        await storageService.uploadFile(file, 1);

        await expect(storageService.getFileUrl('test.txt', 2)).rejects.toThrow('No tiene permisos para leer este archivo');
    });

    test('should share file with another user', async () => {
        const file: FileData = { name: 'test.txt', content: Buffer.from('Hello World') };
        await storageService.uploadFile(file, 1);
        await storageService.shareFileWithUser('test.txt', 1, 2); // Comparte con el usuario 2
        expect(await storageService.listFile(2)).toContainEqual(expect.objectContaining({ name: 'test.txt' }));
    });

    it('should fail to upload a file if storage limit is exceeded', async () => {
        // Intentar subir un archivo de 1 MB cuando el límite ya ha sido alcanzado
        mockProvider.testStorageLimit();
        await expect(storageService.uploadFile({ name: 'bigfile.txt', content: Buffer.alloc(1024 * 1024) }, 1))
            .rejects
            .toThrow("No hay espacio suficiente en el almacenamiento");

    });
});
