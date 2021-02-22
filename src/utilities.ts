export class Utilities {
    public static async delay(ms: number): Promise<void> {
        return new Promise((res) => setTimeout(res, ms));
    }
}
