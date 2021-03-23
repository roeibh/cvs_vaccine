import { launch, Browser, Page } from "puppeteer";
import { inject, singleton } from "tsyringe";
import { IPublisher } from "../../interfaces/IPublisher";
import { TwilioPublisher } from "../../publishers/twilio";

@singleton()
export class NhsScraper {
    constructor(@inject(TwilioPublisher.name) protected publisher: IPublisher) {}

    public async scrape(): Promise<void> {
        const vaccineWebsite = "https://networkhouse.nhsbookings.com/v2/#book/count/1/provider/any/";
        const browser: Browser = await launch();
        const page: Page = await browser.newPage();
        try {
            await page.goto(vaccineWebsite, {
                waitUntil: "domcontentloaded",
            });

            const response = await page.waitForResponse("https://networkhouse.nhsbookings.com/v2/service/", { timeout: 3000 });
            console.log("NHS vaccine response received");
            const jsonData = (await response.json());
            if (jsonData.length > 0) {
                await this.publisher.publish(`There are services open!\nGo quickly and register: ${vaccineWebsite}`);
            }
            const pages = await browser.pages();
            pages.forEach(async (p) => await p.close());
        } catch (err) {
            if (err instanceof Error) {
                console.error(`${err.name}: ${err.message}`);
                console.error(err.stack);
            } else {
                console.error(err);
            }
        } finally {
            await browser.close();
        }
    }
}
