import Image from "next/image";
import React from "react";
import { useWorkshopFilters } from "../useWorkshop";
import { getTutorials } from "@/trpc/type";
import Tutorials from "./Tutorials";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTutorialFilters } from "@/modules/tutorials/hook/useTutorials";

function TutorialsContainer({ data }: { data: getTutorials }) {
  const [filters, setFilters] = useTutorialFilters();

  const totalPages = data.pagination.totalPages;
  const currentPages = data.pagination.currentPage;
  console.log(filters.limit > data.pagination.totalCount, "ajaj");
  return (
    <div className="h-full  py-28 overflow-hiddena">
      <div className="w-[85%] flex items-center gap-4 md:gap-12 flex-col mx-auto">
        <div className="space-y-4 md:space-y-6">
          <h1 className="font-passion-one font-bold text-center  text-[#977DAE] text-4xl  lg:text-8xl uppercase">
            vicky-akku online tutorials
          </h1>
          <p className="text-[#58555A] text-xs md:text-2xl text-center">
            Your favourite choreographies, taught like you’re in the room with
            us. 
          </p>
        </div>
        <div className="w-full h-full">
          {/* <WorkshopcardWrapper workshops={workshops.workshops} /> */}
          <Tutorials tutorials={data} />

          {filters.limit < data.pagination.totalCount && (
            <div className="w-full mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i} className="">
                      <PaginationLink onClick={()=>setFilters({page:i+1})} className={`${filters.page ==i+1 && "bg-white/50"} cursor-pointer transition-all duration-300 ease-in-out`}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorialsContainer;
