import puppeteer from "puppeteer";
import { inject, singleton } from "tsyringe";
import { CVSResponse, LocationDetails } from "./cvsResponse";
import { IPublisher } from "../../interfaces/IPublisher";

@singleton()
export class CvsScraper {
    constructor(@inject("IPublisher") protected publisher: IPublisher) {}
    public async scrape(): Promise<void> {
        const vaccineWebsite = "https://www.cvs.com/immunizations/covid-19-vaccine";

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(vaccineWebsite, {
                waitUntil: "domcontentloaded",
            });

            await page.evaluate(() => $("span:contains('Georgia')")[0]?.click());
            const response = await page.waitForResponse(`${vaccineWebsite}.vaccine-status.GA.json?vaccineinfo`);
            console.log("GA vaccine availability response received");
            const jsonData = (await response.json()) as CVSResponse;
            jsonData.responsePayloadData?.data.GA.forEach(async (location: LocationDetails) => {
                if (Number(location.totalAvailable) >= 0) {
                    console.log(`There are available slots in ${location.city}`);
                    this.publisher.publish(`There are available slots in ${location.city}.\nGo quickly and register: ${vaccineWebsite}`);
                }
            });
            await browser.close();
        } catch (err) {
            if (err instanceof Error) {
                console.error(`${err.name}: ${err.message}`);
                console.error(err.stack);
            } else {
                console.error(err);
            }
        }
    }
}
