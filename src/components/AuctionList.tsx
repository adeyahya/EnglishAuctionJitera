import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Box,
  Button,
  ButtonGroup,
  HStack,
} from "@chakra-ui/react";
import useAuctionList from "@/hooks/useAuctionList";
import AuctionRow from "@/components/AuctionRow";
import { useMemo, useState } from "react";
import { useModal } from "@ebay/nice-modal-react";
import ModalCreateAuction from "@/components/ModalCreateAuction";

const AuctionList = () => {
  const { data = [] } = useAuctionList();
  const [activeFilter, setActiveFilter] = useState<"OPEN" | "CLOSED" | "DRAFT">(
    "OPEN"
  );
  const createAuctionModal = useModal(ModalCreateAuction);

  const filteredData = useMemo(
    () => data.filter((item) => item.status === activeFilter),
    [data, activeFilter]
  );

  return (
    <Box>
      <Box mt="6" mb="4">
        <HStack justify="space-between">
          <Box>
            <ButtonGroup>
              <Button
                onClick={() => setActiveFilter("OPEN")}
                colorScheme={activeFilter === "OPEN" ? "blue" : undefined}
                size="sm"
              >
                Open
              </Button>
              <Button
                onClick={() => setActiveFilter("CLOSED")}
                colorScheme={activeFilter === "CLOSED" ? "blue" : undefined}
                size="sm"
              >
                Completed
              </Button>
              <Button
                onClick={() => setActiveFilter("DRAFT")}
                colorScheme={activeFilter === "DRAFT" ? "blue" : undefined}
                size="sm"
              >
                Draft
              </Button>
            </ButtonGroup>
          </Box>
          <Box>
            <Button onClick={() => createAuctionModal.show()} size="sm">
              Create New Auction
            </Button>
          </Box>
        </HStack>
      </Box>
      <Table>
        <Thead bg="gray.200">
          <Tr>
            <Th>Title</Th>
            <Th>Current Price</Th>
            <Th>Duration</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((auction) => (
            <AuctionRow data={auction} key={auction.id} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AuctionList;
