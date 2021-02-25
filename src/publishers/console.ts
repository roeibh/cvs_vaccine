import { singleton } from "tsyringe";
import { IPublisher } from "../interfaces/IPublisher";

@singleton()
export class ConsolePublisher implements IPublisher {
    public async publish(text: string): Promise<void> {
        console.info(text);
    }
}
