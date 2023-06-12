import useMutateCreateAuction from "@/hooks/useMutateCreateAuction";
import { AuctionRequestDTO, AuctionRequestType } from "@/schema/Auction";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Input,
  Button,
} from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ModalCreateAuction = create(() => {
  const modal = useModal();
  const { mutateAsync, isLoading } = useMutateCreateAuction();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AuctionRequestType>({
    resolver: typeboxResolver(AuctionRequestDTO),
    defaultValues: {
      timeWindow: 1,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
    modal.hide();
  });

  useEffect(() => {
    if (!modal.visible) reset();
  }, [modal.visible, reset]);

  return (
    <Modal isOpen={modal.visible} onClose={modal.hide}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSubmit}>
        <ModalHeader>
          Create Auction
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input {...register("title")} />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.startingPrice}>
              <FormLabel>Staring Price</FormLabel>
              <Input {...register("startingPrice", { valueAsNumber: true })} />
              <FormErrorMessage>
                {errors.startingPrice?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.timeWindow}>
              <FormLabel>Time Window</FormLabel>
              <Input {...register("timeWindow", { valueAsNumber: true })} />
              <FormHelperText>
                How many hours this auction need to be runs?
              </FormHelperText>
              <FormErrorMessage>{errors.timeWindow?.message}</FormErrorMessage>
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

export default ModalCreateAuction;
