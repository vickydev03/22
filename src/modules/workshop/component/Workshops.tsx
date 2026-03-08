import React from "react";
import WorkshopCard from "./WorkshopCard";
import { getWorkshopType } from "@/trpc/type";

export type Workshop = {
  id: string;
  thumbnail: string;
  title: string;
  place: string;
  description: string;
  date: string;
  price: number;
};

function Workshops({ data }: { data: getWorkshopType }) {
  
  return (
    <div className="w-full h-full ">
      <div className="grid  gap-6  grid-cols-1 md:grid-cols-3">
        {data.map((e, i) => (
          <WorkshopCard key={i} workshop={e} />
        ))}
      </div>
    </div>
  );
}

export default Workshops;
