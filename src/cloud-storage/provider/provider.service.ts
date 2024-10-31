import {CloudProvider, ProviderStatus, ProviderType} from "./provider.interface";
import {ProviderRepository} from "./provider.repository";


export class ProviderService {


    // async checkAndSyncProvider(provider: CloudProvider = this.provider): Promise<void> {
    //     // Verifica disponibilidad del provider actual
    //     const isAvailable = await provider.checkAvailability();
    //
    //     // Si el provider está disponible y tiene backup, se sincroniza.
    //     if (isAvailable) {
    //         if (provider.backupProvider) {
    //             await this.syncFromBackup(provider.backupProvider, provider);
    //         }
    //     } else if (provider.backupProvider) {
    //         // Si el provider principal está caído, verificar backup de manera recursiva.
    //         await this.checkAndSyncProvider(provider.backupProvider);
    //     }
    // }

    async getProviderStatus(provider: CloudProvider): Promise<ProviderStatus> {
        const isAvailable = await provider.checkAvailability();
        const providerId = await this.getProviderId(provider.getProviderType());
        return await ProviderRepository.updateProviderStatus(providerId, isAvailable)
    }

    async getProviderId(providerType: ProviderType): Promise<number> {
        return ProviderRepository.findProviderIdByType(providerType);
    }

    async existFileInProvider(fileName: string, provider: CloudProvider): Promise<boolean> {
        const files = await provider.listFiles();
        return files.some(file => file.name === fileName);
    }
}
