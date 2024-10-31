// cloudProviderFactory.ts
import {CloudProvider, ProviderType} from "./provider.interface";
import { AzureProvider } from "./providers/azure.provider";
import AwsProvider from "./providers/aws.provider";

export class CloudProviderFactory {
    static createProvider(type: ProviderType): CloudProvider {
        switch (type) {
            case "azure":
                return new AzureProvider();
            case "aws":
                return new AwsProvider();
            default:
                throw new Error(`Unknown provider type: ${type}`);
        }
    }
}
