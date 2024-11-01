import { Request, Response } from "express";
import {ProviderService} from "./provider.service";

const providerService = new ProviderService();

export class ProviderController {
    async createProvider(req: Request, res: Response): Promise<Response> {
        try {
            const providerType = req.body.providerType;
            await providerService.createProvider(providerType);
            return res.status(201).json({ message: "Provider created successfully" });
        } catch (error) {
            return res.status(500).json({ error: `Error creating provider: ${error.message}` });
        }
    }
}