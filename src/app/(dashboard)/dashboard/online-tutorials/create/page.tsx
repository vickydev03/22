

export const dynamic = "force-dynamic";
import CreateTutorialsView from "@/modules/dashboard/view/CreateTutorialsView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";



async function page() {


const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
        trpc.tutorials.getVideos.queryOptions()
      );
    
  return <HydrationBoundary state={dehydrate(queryClient)} >
            <CreateTutorialsView/>
        </HydrationBoundary> 

}

export default page;
