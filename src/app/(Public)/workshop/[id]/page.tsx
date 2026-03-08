import { loadWorkshopFilter } from "@/modules/workshop/searchParms";
import UpcomingWorkShop from "@/modules/workshop/view/UpcomingWorkShop";
import WorkshopView from "@/modules/workshop/view/workshopView";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import React from "react";

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
    trpc.workshop.getWorkshop.queryOptions({id}),
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
