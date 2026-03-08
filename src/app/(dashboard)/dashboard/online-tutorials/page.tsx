import { loadDashboardUserFilter } from "@/modules/dashboard/hooks/useDashboardClient";
import OnlineTutorialsView from "@/modules/dashboard/view/OnlineTutorialsView";
import RegularClassesView from "@/modules/dashboard/view/RegularClassesView";
import UsersView from "@/modules/dashboard/view/UsersView";
import { loadRegularClassesFilter } from "@/modules/regular-classes/hooks/hook/useRegularClassesClient";
import { loadTutorialsFilter } from "@/modules/tutorials/hook/useTutorialsClient";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import React from "react";

interface PageProps {
  searchParams: Promise<SearchParams>;
}


async function page({searchParams}:PageProps) {

let { page=1, limit=10 } = await loadTutorialsFilter(searchParams);
  
const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
        trpc.tutorials.getTutorials.queryOptions({
          page,limit
        }),
      );
    
  return <HydrationBoundary state={dehydrate(queryClient)} >
            <OnlineTutorialsView/>
        </HydrationBoundary> 

}

export default page;
