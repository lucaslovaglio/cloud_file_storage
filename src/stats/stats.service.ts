import {StatsRepository} from "./stats.repository";
import {UserService} from "../user/user.service";
import {RoleType} from "../role/role.interface";
import {StorageService} from "../cloud-storage/storage.service";
import {AzureStorageService} from "../cloud-storage/storage.factory";
import {DaysRange, StatsList, StatsListItem} from "./stats.interface";
import {User, File} from "@prisma/client";



const userService = new UserService();
const storageService = AzureStorageService;

export class StatsService {
    async getStats(): Promise<StatsList> {
        const daysRange: DaysRange = this.getTodayRange();
        const usersList: User[] = await userService.getUsers();
        const statsList: StatsListItem[] = await this.createStatsList(daysRange, usersList);
        return {
            date: daysRange.start,
            stats: statsList
        }
    }

    private async createStatsList(daysRange: DaysRange, usersList: User[]): Promise<StatsListItem[]> {
        const statsList: StatsListItem[] = [];
        for (const user of usersList) {
            const files = await storageService.getFilesFromUserByDate(user.id, daysRange.start, daysRange.end);
            statsList.push(await this.createStatsListItem(user, files));
        }
        return statsList;
    }

    private async createStatsListItem(user: User, files: File[]): Promise<StatsListItem> {
        const storageUsed = await this.getStorageUsedByUser(user, files);
        return {
            userId: user.id,
            userName: user.email,
            storageUsed: storageUsed
        };
    }

    private async getStorageUsedByUser(user: User, files: File[]): Promise<number> {
        let storageUsed = 0;
        for (const file of files) {
            const fileSize = await storageService.getFileSize(file.name);
            storageUsed += fileSize;
        }
        return storageUsed;
    }

    async isUserAdmin(userId: number) {
        const roles: RoleType[] = await userService.getUserRoles(userId);
        return roles.includes('admin');
    }

    private getTodayRange(): DaysRange {
        const today: Date = new Date();
        today.setHours(0, 0, 0, 0);
        return {
            start: today,
            end: today
        }
    }
}