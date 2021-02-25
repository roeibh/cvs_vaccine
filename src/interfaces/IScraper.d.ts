export interface IScraper {
    public scrape(): Promise<void>;
}
