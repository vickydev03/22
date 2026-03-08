"use client";
import Navbar from "@/component/Navbar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useRegularClassesFilters } from "../hooks/hook/useRegularClasses";
import ContainerBox from "@/modules/signin/component/ContainerBox";
import RegularClassDetails from "../component/RegularClassDetails";

function RegularClassesView() {
  const [filters, setFilters] = useRegularClassesFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.regularClasses.getAllClasses.queryOptions({ ...filters }),
  );

  console.log(data, 789);

  return (
    <div className="h-full min-h-screen bg-hero relative">
      <div className=" absolute  z-53 w-full top-5">
        <Navbar />
      </div>

      <div className="h-full  py-24">
        <div className="w-[85%] flex items-center flex-col mx-auto">
          
          <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
            Regular Classes
          </h1>
          <div className="w-full h-full flex flex-col gap-6">
            {
              data.classes.map((e)=>(
                <>
                   <ContainerBox
                      image={`${e.thumbnail}`}
                      children={<RegularClassDetails data={e}/>}
                      />
                </>
              ))
            }
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegularClassesView;
