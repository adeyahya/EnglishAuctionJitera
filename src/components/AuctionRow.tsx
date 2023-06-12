import { AppContext } from "@/context/AppContext";
import useMutatePublish from "@/hooks/useMutatePublish";
import { AuctionWithBidType } from "@/schema/Auction";
import { formatCurrency } from "@/utils/format";
import { Td, Tr, Text, Button, Badge, Box } from "@chakra-ui/react";
import { useModal } from "@ebay/nice-modal-react";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { useContext, useEffect, useRef } from "react";
import ModalOfferAuction from "@/components/ModalOfferAuction";

function calculateTimeLeft(delta: number) {
  var hours = Math.floor(delta / 3600);
  var minutes = Math.floor((delta % 3600) / 60);
  var seconds = delta % 60;

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

type Props = {
  data: AuctionWithBidType;
};
const AuctionRow = (props: Props) => {
  const { data } = props;
  const { mutate: publish, isLoading: publishLoading } = useMutatePublish();
  const bidModal = useModal(ModalOfferAuction);
  const context = useContext(AppContext);
  const durationRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<NodeJS.Timer>();
  const isDraft = data.status === "DRAFT";
  const isClosed = data.status === "CLOSED";
  const isOpenAndCanBid =
    data.status === "OPEN" && context.user && context.user.id !== data.userId;
  const currentPrice = data.bidList?.[0]?.offer ?? data.startingPrice;
  const highestBid = data.bidList[0];

  useEffect(() => {
    const duration = durationRef.current;
    if (!duration || !data.endedAt) return;
    if (data.status === "CLOSED") return;

    const animateDuration = () => {
      const delta = differenceInSeconds(new Date(data.endedAt!), new Date());
      if (delta < 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const { hours, minutes, seconds } = calculateTimeLeft(delta);
      duration.innerText = `${hours}h ${minutes}m ${seconds}s`;
    };

    animateDuration();
    intervalRef.current = setInterval(animateDuration, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [data]);

  return (
    <Tr key={data.id}>
      <Td>{data.title}</Td>
      <Td>
        <Box>
          <Text>{formatCurrency(currentPrice)}</Text>
          {highestBid ? (
            <Text fontSize="xs" fontWeight="bold">
              Bidder: {highestBid.author.name}
            </Text>
          ) : null}
        </Box>
      </Td>
      <Td>
        <Text ref={durationRef}>0h 0m 0s</Text>
      </Td>
      <Td>
        {isDraft ? (
          <Button
            isLoading={publishLoading}
            onClick={() => publish(data.id)}
            size="sm"
            colorScheme="green"
          >
            Publish
          </Button>
        ) : null}
        {isOpenAndCanBid ? (
          <Button
            onClick={() => bidModal.show({ auctionId: data.id })}
            size="sm"
            colorScheme="blue"
          >
            Bid
          </Button>
        ) : null}
        {isClosed ? <Badge colorScheme="green">Completed</Badge> : null}
      </Td>
    </Tr>
  );
};
export default AuctionRow;
