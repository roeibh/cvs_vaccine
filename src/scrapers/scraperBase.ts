import { IPublisher } from "./../interfaces/IPublisher";
import { inject } from "tsyringe";
import { IScraper } from "./../interfaces/IScraper";
export abstract class ScraperBase implements IScraper {
    constructor(@inject("IPublisher") protected publisher: IPublisher) {}
    abstract scrape(): Promise<void>;
}
