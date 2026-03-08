import WorkshopView from "@/modules/dashboard/view/WorkshopView";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
interface PageProps {
  params:{
    id:string
  }
}


async function page({ params }: PageProps) {
  const queryClient = getQueryClient();
  const {id}=await params
  console.log(id,"ajay")
  void queryClient.prefetchQuery(
    trpc.tutorials.getTutorial.queryOptions({id}),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <WorkshopView id={id} />
      </div>
    </HydrationBoundary>
  );
}

export default page;
