import useMutateBid from "@/hooks/useMutateBid";
import {
  BidRequestType,
  BidRequestDTO,
  AuctionWithBidType,
} from "@/schema/Auction";
import { formatCurrency } from "@/utils/format";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

const ModalOfferAuction = create<{ auctionId: string }>((props) => {
  const modal = useModal();
  const toast = useToast();
  const queryClient = useQueryClient();

  const currentAuctionPrice = useMemo(() => {
    const auctionList: AuctionWithBidType[] =
      queryClient.getQueryData("/api/auction") ?? [];
    const auction = auctionList.find((item) => item.id === props.auctionId);
    const currentPrice =
      auction?.bidList?.[0]?.offer ?? auction?.startingPrice ?? 0;
    return currentPrice;
  }, [props.auctionId, queryClient]);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<BidRequestType>({
    resolver: typeboxResolver(BidRequestDTO),
    defaultValues: {
      offer: 0,
    },
  });
  const { mutateAsync, isLoading } = useMutateBid(props.auctionId, {
    onError: (err: any) => {
      toast({
        status: "error",
        title: "Error Bid",
        description: err?.response?.data?.message,
      });
    },
    onSuccess: () => {
      toast({
        status: "success",
        title: "Success Bid",
        description: `Your offer has been Accepted!`,
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
      modal.hide();
    } catch (error) {}
  });

  useEffect(() => {
    if (!modal.visible) reset({ offer: 0 });
  }, [modal.visible, reset]);

  return (
    <Modal isOpen={modal.visible} onClose={modal.hide}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSubmit}>
        <ModalHeader>
          Make an Offer
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormControl isInvalid={!!errors.offer}>
              <FormLabel>Offer</FormLabel>
              <Input
                {...register("offer", {
                  valueAsNumber: true,
                  min: currentAuctionPrice,
                })}
              />
              <FormErrorMessage>{errors.offer?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={modal.hide}
            mr="2"
            variant="outline"
            colorScheme="red"
          >
            Cancel
          </Button>
          <Button isLoading={isLoading} type="submit" colorScheme="blue">
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default ModalOfferAuction;
