"use client";
import Navbar from "@/component/Navbar";
import ContainerBox from "@/modules/signin/component/ContainerBox";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { data } from "motion/react-client";
import React from "react";
import WorkshopDetails from "../component/workshopDetails";

function WorkshopView({ id }: { id: string }) {
  const trpc = useTRPC();
  const { data: workshop } = useSuspenseQuery(
    trpc.workshop.getWorkshop.queryOptions({ id }),
  );
  
  console.log(data, 55);
  return (
    <div className="h-full min-h-screen bg-hero reative">
      <div className=" absolute  z-53 w-full top-5">
        <Navbar />
      </div>
      
      <div className="h-full  py-24">
        <div className="w-[85%] flex items-center flex-col mx-auto">
          <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
            {workshop.title}
          </h1>
          <div className="w-full h-full">
            <ContainerBox
              image={`${workshop.thumbnail}`}
              children={<WorkshopDetails workshop={workshop} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkshopView;
