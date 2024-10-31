import {CloudProviderFactory} from "./provider/provider.factory";
import {StorageService} from "./storage.service";

const awsProvider = CloudProviderFactory.createProvider("aws");
const azureProvider = CloudProviderFactory.createProvider("azure");
azureProvider.addBackupProvider(awsProvider);

export const AzureStorageService: StorageService = new StorageService(azureProvider);


