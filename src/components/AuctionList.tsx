import { Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import useAuctionList from "@/hooks/useAuctionList";
import AuctionRow from "@/components/AuctionRow";

const AuctionList = () => {
  const { data = [] } = useAuctionList();

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Current Price</Th>
          <Th>Duration</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((auction) => (
          <AuctionRow data={auction} key={auction.id} />
        ))}
      </Tbody>
    </Table>
  );
};

export default AuctionList;
