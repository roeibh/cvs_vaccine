/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { singleton } from "tsyringe";
import { IPublisher } from "../interfaces/IPublisher";
import { TwilioConfig } from "../config/config";
import { Utilities } from "../utilities";
import { Twilio } from "twilio";

@singleton()
export class TwilioPublisher implements IPublisher {
    public async publish(text: string): Promise<void> {
        try {
            const accountSid = TwilioConfig.Config().accountSid;
            const authToken = TwilioConfig.Config().authToken;
            const client = new Twilio(accountSid!, authToken!);
            let message = await client.messages
                .create({
                    body: text,
                    from: TwilioConfig.Config().from,
                    to: TwilioConfig.Config().to1 || ""
                });
            console.info(`message #${message.sid} sent`);
            await Utilities.delay(1000 * 60 * 3);
            message = await client.messages
                .create({
                    body: text,
                    from: TwilioConfig.Config().from,
                    to: TwilioConfig.Config().to2 || ""
                });
            console.info(`message #${message.sid} sent`);
        } catch (error) {
            console.error(error);
        }
    }
}
