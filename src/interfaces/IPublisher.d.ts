export interface IPublisher {
    public async publish(text: string): Promise<void>;
}
