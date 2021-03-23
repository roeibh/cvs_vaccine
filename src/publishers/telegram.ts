import axios from "axios";
import { singleton } from "tsyringe";
import { IPublisher } from "../interfaces/IPublisher";
import { TelegramConfig } from "../config/config";
import { Utilities } from "../utilities";

@singleton()
export class TelegramPublisher implements IPublisher {
    public async publish(text: string): Promise<void> {
        try {
            await axios.post(`https://api.telegram.org/bot${TelegramConfig.Config().botToken}/sendMessage`, {
                chat_id: `-100${TelegramConfig.Config().channelId}`,
                text: text,
            });
            await Utilities.delay(1000);
        } catch (error) {
            console.error(error);
        }
    }
}
