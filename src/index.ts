import * as dotenv from "dotenv";
dotenv.config(); // Make sure this run first
import schedule from "node-schedule";
import "reflect-metadata";
import { container } from "tsyringe";
import { IPublisher } from "./interfaces/IPublisher.d";
import { IScraper } from "./interfaces/IScraper";
import { TelegramPublisher as TelegramPublisher } from "./publishers/telegram/telegram";
import { CvsScraper } from "./scrapers/cvs/cvsScraper";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("log-timestamp")(() => {
    const date = new Date();
    return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`;
});

container.register<IPublisher>("IPublisher", TelegramPublisher);
container.register<IScraper>("IScraper", CvsScraper);

async function main() {
    const scraper = container.resolve<IScraper>("IScraper");
    const job = schedule.scheduleJob("Scrape Job", "* */5 * * * *", async () => {
        await scraper.scrape();
    });

    job.on("scheduled", () => {
        console.info("Job scheduled Successfully");
    });

    job.on("run", () => {
        console.info("Job Executed Successfully");
    });

    job.on("error", () => {
        console.error("Job Failed");
    });
}

main();
