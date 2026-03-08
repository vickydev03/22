// export const dynamic = "force-dynamic";
import HeroSkeleton from '@/component/HeroLoader';
import HomeView from '@/modules/home/view/HomeView'
// import { caller, getQueryClient, trpc } from '@/trpc/server'
import React, { Suspense } from 'react'

async function page() {

  // let u=await caller.user.profile()
  // u?u:null
  // const queryClient = getQueryClient();
    

    // void queryClient.prefetchQuery(trpc.workshop.upcomingWorkshop.queryOptions({
    //       page:1,
    //       limit:3,
    //       location:"all"
    //     }),);
  
  // console.log(u,"vickysingh")
  return (
    <div>
      <Suspense fallback={<HeroSkeleton/>}>
        <HomeView/>
      </Suspense>
    </div>
  )
}

export default page