import { Button } from "@/components/ui/button";
import Workshops from "@/modules/workshop/component/Workshops";
import { getWorkshopType } from "@/trpc/type";
import React from "react";

function UpcomingWorkshop({workshops}:{workshops:getWorkshopType}) {
  
  return (
    <div className=" w-full ">
      <div className="w-[90%] space-y-4 px-6 md:px-12 py-8 md:w-[90%] rounded-3xl bg-[#FFFBF4]  mx-auto">
        <div className=" flex gap-4 flex-col md:flex-row justify-center items-center md:justify-between ">
          <div className=" font-p flex md:block items-center gap-2 justify-center flex-col">
            <h3 className=" uppercase text-center md:text-start  font-passion-one text-secondary-color text-4xl">
              upcoming Workshops
            </h3>
            <p className=" max-w-42 md:max-w-full text-center md:text-start capitalize text-[#777873] font-semibold text-2xl  md:text-sm tracking-wide">
              Workshop across city
            </p>
          </div>

          <div>
            <Button className=" border bg-transparent text-black  rounded-full  font-open-sauce border-[#736E4E]">
              View more
            </Button>
          </div>
        </div>
        <section className="">
          <Workshops data={workshops} />
        </section>
      </div>
    </div>
  );
}

export default UpcomingWorkshop;
