import { Table, Thead, Tbody, Tr, Td, Th } from "@chakra-ui/react";
import useAuctionList from "@/hooks/useAuctionList";

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
          <Tr key={auction.id}>
            <Td>{auction.title}</Td>
            <Td>{auction.startingPrice}</Td>
            <Th>{auction.timeWindow}</Th>
            <Th>bid</Th>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default AuctionList;
