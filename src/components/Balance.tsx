import useBalance from "@/hooks/useBalance";
import { formatCurrency } from "@/utils/format";
import { VStack, Text, Skeleton } from "@chakra-ui/react";

const Balance = () => {
  const { data, isLoading } = useBalance();

  const balance = data?.balance ?? 0;
  const reservedBalance = data?.reserved ?? 0;
  const availableBalance = balance - reservedBalance;
  return (
    <Skeleton isLoaded={!isLoading}>
      <VStack spacing="0" align="end">
        <Text fontWeight="bold" fontSize="xs">
          Balance: <Text as="span">{formatCurrency(availableBalance)}</Text>
        </Text>
      </VStack>
    </Skeleton>
  );
};

export default Balance;
