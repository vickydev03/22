import RegularClassView from "@/component/RegularClassView";
import { getQueryClient, trpc } from "@/trpc/server";
import React from "react";


interface PageProps {
  params:{
    id:string
  }
}

async function page({params}:PageProps) {
    const queryClient = getQueryClient();
      const {id}=await params
      console.log(id,"ajay")
      void queryClient.prefetchQuery(
        trpc.regularClasses.getClassAdmin.queryOptions({id}),
      );
    
  return <RegularClassView id={id} />;
}

export default page;
