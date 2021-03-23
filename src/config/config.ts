import { str, num, cleanEnv } from "envalid";

export class TelegramConfig {
    public static Config(): { [key: string]: string | number; } {
        const env = cleanEnv(process.env, {
            BOT_TOKEN: str(),
            CHANNEL_ID: num(),
            NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
        });

        return {
            botToken: env.BOT_TOKEN,
            channelId: env.CHANNEL_ID,
        };
    }
}

export class SmsConfig {
    public static Config(): { [key: string]: string; } {
        const env = cleanEnv(process.env, {
            ACCOUNT_SID: str(),
            AUTH_TOKEN: str(),
            NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
        });

        return {
            accountSid: env.ACCOUNT_SID,
            channelId: env.AUTH_TOKEN,
        };
    }
}
