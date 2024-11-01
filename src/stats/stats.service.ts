import {UserService} from "../user/user.service";
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
            const storageUsed = await storageService.getStorageFromUserByDate(user.id, daysRange);
            statsList.push(this.createStatsListItem(user, storageUsed));
        }
        return statsList;
    }

    private createStatsListItem(user: User, storageUsed: number): StatsListItem {
        return {
            userId: user.id,
            userName: user.email,
            storageUsed: storageUsed
        };
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