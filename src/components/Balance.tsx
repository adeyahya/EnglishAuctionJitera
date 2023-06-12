import useBalance from "@/hooks/useBalance";
import { formatCurrency } from "@/utils/format";
import { VStack, Text, Skeleton } from "@chakra-ui/react";

const Balance = () => {
  const { data, isLoading } = useBalance();

  return (
    <Skeleton isLoaded={!isLoading}>
      <VStack spacing="0" align="end">
        <Text fontWeight="bold" fontSize="xs">
          Usable: <Text as="span">{formatCurrency(data?.balance ?? 0)}</Text>
        </Text>
        <Text fontWeight="bold" fontSize="xs" color="orange.600">
          Reserved: <Text as="span">{formatCurrency(data?.reserved ?? 0)}</Text>
        </Text>
      </VStack>
    </Skeleton>
  );
};

export default Balance;