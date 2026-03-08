import React from "react";
import WorkshopcardWrapper from "./WorkshopcardWrapper";
import { getLocation, getWorkshop } from "@/trpc/type";
import Image from "next/image";
import { useWorkshopFilters } from "../useWorkshop";

function WorkshopContainer({
  workshops,
  locations,
}: {
  workshops: getWorkshop;
  locations: getLocation;
}) {
  console.log(locations, 456);
  
  const [filters, setFilters] = useWorkshopFilters();

  return (
    <div className="h-full  py-28 overflow-hiddena">
      <div className="w-[85%] flex items-center gap-4 md:gap-12 flex-col mx-auto">
        <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
          Upcoming Workshops
        </h1>
        <div className="overflow-scroll overflow-y-hidden scroll-smooth hide-scrollbar pl-40 md:pl-0 max-w-screen flex items-center flex-nowrap justify-center gap-1 md:gap-2">
          <div
            className={`rounded-2xl bg-[#FFFBF4]   min-w-24 min-h-18 md:w-35.5 md:h-28.5 relative `}
            style={{ border: "3px solid #D2D2D2" }}
          >
            <input
              className="hidden"
              type="radio"
              id={"all"}
              onChange={(e) => setFilters({ location: e.target.value })}
              checked={filters.location == "all"}
              value={"all"}
            />

            <label
              htmlFor={"all"}
              className={`flex flex-col rounded-2xl w-full h-full cursor-pointer items-center px-4 transition-all duration-500  py-2 ${
                "all" == filters.location ? "bg-[#977DAE] text-white" : ""
              }`}
            >
              <span
                className={`capitalize text-[#777873] ${"all" == filters.location && "text-white"} text-xs md:text-[24px] tracking-wider`}
              >
                All
              </span>
              <Image
                src={"/image/1.png"}
                alt={""}
                height={100}
                className=" max-w-18 md:max-w-24 absolute top-[20%]"
                width={100}
              />
            </label>
          </div>
          {locations.map((e) => (
            <div
              key={e.id}
              className={`rounded-2xl bg-[#FFFBF4]   w-24 h-18 md:w-35.5 md:h-28.5 relative `}
              style={{ border: "3px solid #D2D2D2" }}
            >
              <input
                className="hidden"
                type="radio"
                id={e.city}
                onChange={(e) => setFilters({ location: e.target.value })}
                checked={filters.location == e.city}
                value={e.city}
              />

              <label
                htmlFor={e.city}
                className={`flex flex-col rounded-2xl w-full h-full cursor-pointer items-center px-4 transition-all duration-500  py-2 ${
                  e.city == filters.location ? "bg-[#977DAE] text-white" : ""
                }`}
              >
                <span
                  className={`capitalize text-[#777873] ${e.city == filters.location && "text-white"} text-xs md:text-[24px] tracking-wider`}
                >
                  {e.city}
                </span>
                <Image
                  src={e.image}
                  alt={e.city}
                  height={100}
                  className=" max-w-18 md:max-w-24 absolute top-[20%]"
                  width={100}
                />
              </label>
            </div>
          ))}
        </div>
        <div className="w-full h-full">
          <WorkshopcardWrapper workshops={workshops.workshops} />
        </div>
      </div>
    </div>
  );
}

export default WorkshopContainer;
