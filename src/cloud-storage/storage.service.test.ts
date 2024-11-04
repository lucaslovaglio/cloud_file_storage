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

    it('should upload a file even when the service is unavailable, and then sync when its available again', async () => {
        // Configura la disponibilidad en false
        mockProvider.setAvailability(false);

        // Intenta subir un archivo
        const file: FileData = { name: 'testfile5.txt', content: Buffer.from('This is a test file.') };
        await storageService.uploadFile(file, 1);

        // Verifica que el archivo se haya subido correctamente
        const providerFiles  = await mockProvider.listFiles();
        const serviceFiles  = await storageService.listFile(1);
        const backupProviderFiles  = await mockProvider.backupProvider.listFiles();
        expect(providerFiles).not.toEqual(backupProviderFiles);

        mockProvider.setAvailability(true);

        const updatedServiceFiles  = await storageService.listFile(1);
        // Once the provider is available again, the file should be synced
        const updatedProviderFiles  = await mockProvider.listFiles();
        const updatedBackupProviderFiles  = await mockProvider.backupProvider.listFiles();
        expect(updatedProviderFiles).toEqual(updatedBackupProviderFiles);
    }, 300000);



    it('should fail to upload a file if storage limit is exceeded', async () => {
        // Intentar subir un archivo de 1 MB cuando el límite ya ha sido alcanzado
        mockProvider.testStorageLimit();
        await expect(storageService.uploadFile({ name: 'bigfile.txt', content: Buffer.alloc(1024 * 1024) }, 1))
            .rejects
            .toThrow("No hay espacio suficiente en el almacenamiento");

    });
});
