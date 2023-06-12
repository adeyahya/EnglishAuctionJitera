import { AppContext } from "@/context/AppContext";
import useMutatePublish from "@/hooks/useMutatePublish";
import { AuctionWithBidType } from "@/schema/Auction";
import { formatCurrency } from "@/utils/format";
import { Td, Tr, Text, Button, Badge } from "@chakra-ui/react";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import { useContext, useEffect, useRef } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

type Props = {
  data: AuctionWithBidType;
};
const AuctionRow = (props: Props) => {
  const { data } = props;
  const { mutate: publish, isLoading: publishLoading } = useMutatePublish();
  const context = useContext(AppContext);
  const durationRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<NodeJS.Timer>();
  const isDraft = data.status === "DRAFT";
  const isClosed = data.status === "CLOSED";
  const isOpenAndCanBid =
    data.status === "OPEN" && context.user && context.user.id !== data.userId;

  useEffect(() => {
    const duration = durationRef.current;
    if (!duration || !data.endedAt) return;

    const animateDuration = () => {
      const diffMs = differenceInMilliseconds(
        new Date(data.endedAt!),
        new Date()
      );
      const hourLeft = Math.abs(Math.trunc(diffMs / HOUR));
      const minutesLeft = Math.abs(Math.trunc((diffMs % HOUR) / MINUTE));
      const secondsLeft = Math.abs(Math.trunc((diffMs % MINUTE) / SECOND));
      duration.innerText = `${hourLeft}h ${minutesLeft}m ${secondsLeft}s`;
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
      <Td>{formatCurrency(data.startingPrice)}</Td>
      <Td>
        <Text ref={durationRef} />
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
          <Button size="sm" colorScheme="blue">
            Bid
          </Button>
        ) : null}
        {isClosed ? <Badge colorScheme="green">Completed</Badge> : null}
      </Td>
    </Tr>
  );
};
export default AuctionRow;
