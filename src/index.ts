import * as dotenv from "dotenv";
dotenv.config(); // Make sure this run first
import "reflect-metadata";
import { container } from "tsyringe";
import { IPublisher } from "./interfaces/IPublisher.d";
import { IScraper } from "./interfaces/IScraper";
import { TelegramPublisher as TelegramPublisher } from "./publishers/telegram/telegram";
import { CvsScraper } from "./scrapers/cvs/cvsScraper";
import { Utilities } from "./utilities";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("log-timestamp")(() => {
    const date = new Date();
    return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`;
});

container.register<IScraper>("IScraper", CvsScraper);
container.register<IPublisher>("IPublisher", TelegramPublisher);

async function mainLoop(ms: number) {
    const scraper = container.resolve<IScraper>("IScraper");
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await scraper.Scrape();
        await Utilities.delay(ms);
    }
}

mainLoop(1000 * 60 * 10 /*run every 10 minutes*/).catch((err) => console.error(err));
