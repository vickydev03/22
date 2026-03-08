
export const dynamic = "force-dynamic"
import React from 'react'
import VideoPlayerView from './VideoPlayerView'

import { caller, getQueryClient, trpc } from "@/trpc/server";
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
  let u=await caller.user.profile()
  u?u:null
  console.log(id,"ajay")
  void queryClient.prefetchQuery(
    trpc.tutorials.playVideos.queryOptions({tutorialId:id,userId:u.id}),
  );


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
            <VideoPlayerView tutorialId={id} userId={u.id}/>
      </div>
    </HydrationBoundary>
  );
}

export default page;
