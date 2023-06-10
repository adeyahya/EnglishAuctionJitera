interface QueueRepositoryInterface {
  placeOffer(params: object): Promise<void>;
  findOfferInQueue(params: object): Promise<object | undefined>;
}

export default QueueRepositoryInterface;
