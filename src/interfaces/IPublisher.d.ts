export interface IPublisher {
    public publish(text: string): Promise<void>;
}
