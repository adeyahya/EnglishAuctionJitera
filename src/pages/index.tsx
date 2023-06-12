import AppLayout from "@/components/AppLayout";
import useAuctionList from "@/hooks/useAuctionList";

export default function Home() {
  const { data } = useAuctionList();
  console.log(data);
  return (
    <AppLayout>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi aperiam
        ullam, exercitationem nihil asperiores consectetur velit voluptatibus
        quidem? Possimus sapiente maxime cumque adipisci architecto saepe iusto,
        laborum perspiciatis! Qui, ducimus.
      </p>
    </AppLayout>
  );
}
