import { Type, Static } from "@sinclair/typebox";

export const AuctionDTO = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.Union([Type.Null(), Type.String()])),
  startingPrice: Type.Number(),
  status: Type.String(),
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
  "userId",
]);
export type AuctionRequestType = Static<typeof AuctionRequestDTO>;
