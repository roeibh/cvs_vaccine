import * as dotenv from "dotenv";
dotenv.config(); // Make sure this run first
import schedule from "node-schedule";
import "reflect-metadata";
import { container } from "tsyringe";
import { IPublisher } from "./interfaces/IPublisher.d";
import { IScraper } from "./interfaces/IScraper";
import { ConsolePublisher } from "./publishers/console";
import { TelegramPublisher } from "./publishers/telegram";
import { TwilioPublisher } from "./publishers/twilio";
import { CvsScraper } from "./scrapers/cvs/cvsScraper";
import { NhsScraper } from "./scrapers/nhs/nhsScraper";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("log-timestamp")(() => {
    const date = new Date();
    return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`;
});

container.register<IPublisher>(TelegramPublisher.name, TelegramPublisher);
container.register<IPublisher>(ConsolePublisher.name, ConsolePublisher);
container.register<IPublisher>(TwilioPublisher.name, TwilioPublisher);
container.register<IScraper>(CvsScraper.name, CvsScraper);
container.register<IScraper>(NhsScraper.name, NhsScraper);

async function main() {
    const scrappers: IScraper[] = [
        container.resolve<IScraper>(CvsScraper.name),
        container.resolve<IScraper>(NhsScraper.name)
    ];
    // await Promise.all(scrappers.map(async s => await s.scrape()));

    const job = schedule.scheduleJob("Scrape Job", "*/10 * * * *", async () => {
        await Promise.all(scrappers.map(async s => await s.scrape()));
    });

    job.on("run", () => {
        console.info("Job Executed");
    });

    job.on("error", () => {
        console.error("Job Failed");
    });
}

main().catch(err => console.error(err));
