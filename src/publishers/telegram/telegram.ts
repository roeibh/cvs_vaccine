import axios from "axios";
import { singleton } from "tsyringe";
import { IPublisher } from "../../interfaces/IPublisher";
import config from "../../config/telegramConfig";
import { Utilities } from "../../utilities";

@singleton()
export class TelegramPublisher implements IPublisher {
    public async publish(text: string): Promise<void> {
        try {
            await axios.post(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
                chat_id: `-100${config.channelId}`,
                text: text,
            });
            await Utilities.delay(1000);
        } catch (error) {
            console.error(error);
        }
    }
}
