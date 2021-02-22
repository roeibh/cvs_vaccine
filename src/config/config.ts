import { str, num, cleanEnv } from "envalid";

class TelegramConfig {
    public static Config() {
        const env = cleanEnv(process.env, {
            BOT_TOKEN: str(),
            CHANNEL_ID: num(),
            NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
        });

        return {
            telegram: {
                botToken: env.BOT_TOKEN,
                channelId: env.CHANNEL_ID,
            },
        };
    }
}

export default TelegramConfig.Config();
