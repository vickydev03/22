"use client"
import React, { Suspense, useRef } from "react";
import Hero from "../component/Hero";
import Navbar from "@/component/Navbar";
import UpcomingWorkshop from "../component/UpcomingWorkshop";
import Introduction from "../component/Introduction";
import ClassDetails from "../component/ClassDetails";
import LearnAnytime from "../component/LearnAnytime";
import ReviewSection from "../component/ReviewSection";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useInView } from "motion/react";
import CardLoader from "@/component/CardLoader";

function HomeView() {
  const trpc=useTRPC()
  const ref = useRef<HTMLDivElement | null>(null);
const inView = useInView(ref, { once: true });
  const { data: workshop } = useQuery({
  ...trpc.workshop.upcomingWorkshop.queryOptions({
    page: 1,
    limit: 3,
    location: "all",
  }),
  enabled: inView,
});
  return (
    <div className=" space-y-2s relative">
      <div className=" absolute  z-53 w-full top-5">
        <Navbar/>
      </div>
      <Hero />
      <div className="-mt-32  md:-mt-72 z-60 relative bg-hero" ref={ref}>
        <Suspense fallback={<CardLoader/>}>

         {workshop?.workshops&&<UpcomingWorkshop workshops={workshop?.workshops} />}
        </ Suspense>
      </div>
      <Introduction />
      <ClassDetails/>
      <LearnAnytime />
      <ReviewSection/>
    </div>
  );
}

export default HomeView;
