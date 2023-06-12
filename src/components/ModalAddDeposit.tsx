import useMutateDeposit from "@/hooks/useMutateDeposit";
import { DepositRequestDTO, DepositRequestType } from "@/schema/Account";
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
} from "@chakra-ui/react";
import { create, useModal } from "@ebay/nice-modal-react";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ModalAddDeposit = create(() => {
  const modal = useModal();
  const { mutateAsync, isLoading } = useMutateDeposit();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<DepositRequestType>({
    resolver: typeboxResolver(DepositRequestDTO),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
    modal.hide();
  });

  useEffect(() => {
    if (!modal.visible) reset({ amount: 0 });
  }, [modal.visible, reset]);

  return (
    <Modal isOpen={modal.visible} onClose={modal.hide}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={onSubmit}>
        <ModalHeader>
          Add Deposit
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Stack>
            <FormControl isInvalid={!!errors.amount}>
              <FormLabel>Deposit Amount</FormLabel>
              <Input {...register("amount", { valueAsNumber: true })} />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
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

export default ModalAddDeposit;
