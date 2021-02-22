import puppeteer from "puppeteer";
import { CVSResponse, GaLocation } from "./interfaces/cvsResponse";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("log-timestamp")(function () {
  const date = new Date();
  return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`;
});

async function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function mainLoop(ms: number) {
  while (true) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto("https://www.cvs.com/immunizations/covid-19-vaccine", {
        waitUntil: "domcontentloaded",
      });

      await page.evaluate(() => $("span:contains('Georgia')")[0]?.click());
      const response = await page.waitForResponse(
        "https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status.GA.json?vaccineinfo"
      );
      console.log("Ga vaccine availability response received");
      const jsonData = (await response.json()) as CVSResponse;
      jsonData.responsePayloadData?.data.GA.forEach(
        async (location: GaLocation) => {
          if (Number(location.totalAvailable) > 0) {
            console.log(`There are available slots in ${location.city}`);
            try {
              await axios.post(
                "https://api.telegram.org/bot1624288777:AAHNb7eBOEX-A_mPtKp8a1uB8v4TrC39Snk/sendMessage",
                {
                  chat_id: "-1001370142323",
                  text: `There are available slots in ${location.city}.\nGo quickly and register: https://www.cvs.com/immunizations/covid-19-vaccine`,
                }
              );
              await delay(1000);
            } catch (error) {
              console.error(error);
            }
          }
        }
      );
      await browser.close();
    } catch (err) {
      if (err instanceof Error) {
        console.error(`${err.name}: ${err.message}`);
        console.error(err.stack);
      } else {
        console.error(err);
      }
    }
    await delay(ms);
  }
}

mainLoop(1000 * 60 * 10 /*run every 10 minutes*/).catch((err) =>
  console.error(err)
);
