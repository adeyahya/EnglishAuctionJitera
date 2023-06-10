import { Type, Static } from "@sinclair/typebox";

export const AuctionDTO = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  startingPrice: Type.Number({
    exclusiveMinimum: 0,
  }),
  status: Type.String(),
  timeWindow: Type.Number({
    minimum: 1,
  }),
  endedAt: Type.Optional(Type.Union([Type.Null(), Type.Date()])),
  publishedAt: Type.Optional(Type.Union([Type.Null(), Type.Date()])),
  userId: Type.String(),
  createdAt: Type.Date(),
  updatedAt: Type.Date(),
});
export type AuctionType = Static<typeof AuctionDTO>;

export const AuctionRequestDTO = Type.Pick(AuctionDTO, [
  "title",
  "description",
  "startingPrice",
  "timeWindow",
]);
export type AuctionRequestType = Static<typeof AuctionRequestDTO>;

export const BidDTO = Type.Object({
  id: Type.String(),
  offer: Type.Number(),
  auctionId: Type.String(),
  userId: Type.String(),
  createdAt: Type.Date(),
});
export type BidType = Static<typeof BidDTO>;
