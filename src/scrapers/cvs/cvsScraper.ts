import { launch, Browser, Page } from "puppeteer";
import { inject, singleton } from "tsyringe";
import { CVSResponse, LocationDetails } from "./cvsResponse";
import { IPublisher } from "../../interfaces/IPublisher";
import { TelegramPublisher } from "../../publishers/telegram";

@singleton()
export class CvsScraper {
    constructor(@inject(TelegramPublisher.name) protected publisher: IPublisher) {}
    private previousLocationDetails: LocationDetails[] = [];

    public async scrape(): Promise<void> {
        const vaccineWebsite = "https://www.cvs.com/immunizations/covid-19-vaccine";
        const browser: Browser = await launch();
        const page: Page = await browser.newPage();
        try {
            await page.goto(vaccineWebsite, {
                waitUntil: "domcontentloaded",
            });

            await page.evaluate(() => $("span:contains('Georgia')")[0]?.click());
            const response = await page.waitForResponse(`${vaccineWebsite}.vaccine-status.GA.json?vaccineinfo`, { timeout: 3000 });
            console.log("GA vaccine availability response received");
            const jsonData = (await response.json()) as CVSResponse;
            const currentAvailability = jsonData.responsePayloadData?.data.GA;
            if (currentAvailability === undefined || JSON.stringify(currentAvailability) === JSON.stringify(this.previousLocationDetails)) return;
            jsonData.responsePayloadData?.data.GA.forEach(async (location: LocationDetails) => {
                if (
                    location.status !== "Fully Booked" &&
                    (this.previousLocationDetails.length === 0 ||
                        !this.previousLocationDetails.find((l: LocationDetails) => l.city === location.city)?.status ||
                        this.previousLocationDetails.find((l: LocationDetails) => l.city === location.city)?.status === "Fully Booked")
                ) {
                    console.log(`There are available slots in ${location.city}`);
                    await this.publisher.publish(`There are available slots in ${location.city}.\nGo quickly and register: ${vaccineWebsite}`);
                }
            });
            this.previousLocationDetails = JSON.parse(JSON.stringify(currentAvailability)); // copy array by value
            const pages = await browser.pages();
            pages.forEach(async (p) => await p.close());
            await browser.close();
        } catch (err) {
            if (err instanceof Error) {
                console.error(`${err.name}: ${err.message}`);
                console.error(err.stack);
            } else {
                console.error(err);
            }
            await browser.close();
        } finally {
            await browser.close();
        }
    }
}
