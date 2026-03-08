import { loadDashboardUserFilter } from "@/modules/dashboard/hooks/useDashboardClient";
import UsersView from "@/modules/dashboard/view/UsersView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import React from "react";

interface PageProps {
  searchParams: Promise<SearchParams>;
}


async function page({searchParams}:PageProps) {

  let { page=1, limit=10 } = await loadDashboardUserFilter(searchParams);
  
    const queryClient = getQueryClient();
          
  void queryClient.prefetchQuery(
        trpc.user.getAllUser.queryOptions({
          page,limit
        }),
      );
      
  return <HydrationBoundary state={dehydrate(queryClient)} >
    <UsersView/>;

  </HydrationBoundary> 

}

export default page;
