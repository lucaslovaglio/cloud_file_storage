export const StatsRepository = {
    async getStats() {
        return {
            users: 10,
            roles: 3,
            permissions: 5,
        };
    }
}