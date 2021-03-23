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

export class TwilioConfig {
    public static Config(): { [key: string]: string; } {
        const env = cleanEnv(process.env, {
            ACCOUNT_SID: str(),
            AUTH_TOKEN: str(),
            TWILIO_FROM: str(),
            TWILIO_PHONE_1: str(),
            TWILIO_PHONE_2: str(),
            NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
        });
        
        return {
            accountSid: env.ACCOUNT_SID,
            authToken: env.AUTH_TOKEN,
            from: env.TWILIO_FROM,
            to1: env.TWILIO_PHONE_1,
            to2: env.TWILIO_PHONE_2
        };
    }
}
