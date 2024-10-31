export interface DaysRange {
    start: Date;
    end: Date;
}

export interface StatsListItem {
    userId: number;
    userName: string;
    storageUsed: number;
}

export interface StatsList {
    date: Date;
    stats: StatsListItem[];
}