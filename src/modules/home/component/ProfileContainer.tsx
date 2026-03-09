import React from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { format } from "date-fns";

function ProfileContainer() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions());

  const isActive =
    new Date(data.userSubscription[0].class.endDate) < new Date();

  return (
    <div className="pt-[10rem] md:py-24 px-4">
      <div className="bg-[#FFFBF4] py-6 rounded-[30px] lg:min-h-96">
        <div className="w-full h-full flex flex-col lg:flex-row items-center gap-2 lg:gap-12">
          {/* Avatar */}
          <div className="flex items-center -mt-[25%] md:-mt-[0%] justify-between w-full md:w-fit md:h-fit p-3 lg:p-12">
            <div className="bg-red-400 rounded-full size-28 sm:size-36 md:size-48 lg:size-72 flex items-center justify-center text-white text-2xl font-bold">
              a
            </div>

            <div className="flex justify-center pt-[3rem] w-fit md:w-full h-full md:hidden  items-center">
              <button
                className={`font-open-sauce px-5  md:hidden py-1 ${
                  !isActive
                    ? "bg-[#F2E9F9] border-[#977DAE]"
                    : "bg-[#F7EDDD] border-[#A48E6A]"
                } rounded-full tracking-wider text-[#827B70] border-2 text-sm sm:text-md lg:text-lg font-medium capitalize`}
              >
                {isActive ? "Rejoin" : "Active"}
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="w-full space-y-2 text-left px-4 lg:px-0">
            <h3 className="font-bold tracking-wider text-[#2A2A2A] font-open-sauce text-2xl sm:text-3xl capitalize">
              {data.name}
            </h3>

            <p className="capitalize text-[#656565] font-open-sauce text-sm sm:text-lg lg:text-xl font-medium tracking-wider">
              {data.phone}
            </p>

            {/* Class */}
            <div className="flex  flex-col sm:flex-row  lg:items-start gap-3 sm:gap-6 justify-center lg:justify-start">
              <p className="capitalize text-[#656565] font-open-sauce text-sm sm:text-lg lg:text-xl font-medium tracking-wider">
                {data.userSubscription[0].class.title}
              </p>

              <button
                className={`font-open-sauce hidden md:block px-5 py-1 ${
                  !isActive
                    ? "bg-[#F2E9F9] border-[#977DAE]"
                    : "bg-[#F7EDDD] border-[#A48E6A]"
                } rounded-full tracking-wider text-[#827B70] border-2 text-sm sm:text-md lg:text-lg font-medium capitalize`}
              >
                {isActive ? "Rejoin" : "Active"}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center   lg:justify-start gap-6 pt-4">
              {/* Workshops */}
              <div className="flex items-center gap-3">
                <div className="bg-[#977DAE] text-white font-semibold flex items-center justify-center w-[50px] h-[50px] md:size-18 rounded-md md:rounded-3xl text-sm md:text-lg">
                  {data.enrollments.length}
                </div>

                <div className="flex flex-col leading-tight">
                  <p className="text-sm md:text-lg">Workshop</p>
                  <p className="text-sm md:text-lg">Booked</p>
                </div>
              </div>

              {/* Tutorials */}
              <div className="flex items-center gap-3">
                <div className="bg-[#977DAE] text-white font-semibold flex items-center justify-center w-[50px] h-[50px] md:size-18 rounded-md md:rounded-3xl text-sm md:text-lg">
                  {data.tutorialAccess.length}
                </div>

                <div className="flex flex-col leading-tight">
                  <p className="text-sm md:text-lg">Purchased</p>
                  <p className="text-sm md:text-lg">Tutorials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%]a mx-auto">
        <h2 className="font-passion-one text-3xl md:text-5xl  text-[#DAA3B0] uppercase">
          My Booking
        </h2>
        <Tabs defaultValue="workshops">
          <TabsList  className="bg-transparent gap-4">
            <div className="w-full h-full flex items-center gap-4">
              <TabsTrigger
                className="rounded-full border-2 border-[#CFCFCF] tracking-wide bg-[#FFFBF4] px-4  font-semibold text-[#656565] data-[state=active]:bg-primary
  data-[state=active]:text-white
  data-[state=active]:border-primary hover:bg-primary hover:text-white"
                value="workshops"
              >
                Workshops
              </TabsTrigger>

              <TabsTrigger
                className="rounded-full border-2 border-[#CFCFCF] tracking-wide bg-[#FFFBF4] px-4  font-semibold text-[#656565] data-[state=active]:bg-primary
  data-[state=active]:text-white
  data-[state=active]:border-primary hover:bg-primary hover:text-white"
                value="online tutorial"
              >
                Online Tutorial
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full border-2 border-[#CFCFCF] tracking-wide bg-[#FFFBF4] px-4  font-semibold text-[#656565] data-[state=active]:bg-primary
  data-[state=active]:text-white
  data-[state=active]:border-primary hover:bg-primary hover:text-white"
                value="Regular Class"
              >
                Regular Classes
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="workshops">
            <div className="flex col w-full gap-4">
              {data.enrollments.map((e, i) => {
                const formattedDate = format(
                  e.workshop.eventDate,
                  "do MMM yyyy | h b",
                ).toUpperCase();
                return (
                  <div
                    key={i}
                    className="bg-[#FFFBF4] w-full flex flex-col md:flex-row gap-5 rounded-[30px] px-4 py-4"
                  >
                    <div className=" relative">
                      <Image
                        alt={e.workshop.title}
                        className=" w-full md:w-64 max-h-[250px] md:max-h-42 object-cover md:object-center  rounded-[30px]"
                        height={100}
                        width={100}
                        src={e.workshop.thumbnail}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between w-full">
                      <div className="flex flex-col gap-2 md:gap-4">
                        <h3 className="font-open-sauce text-center md:text-left font-bold text-[#656565] text-xl md:text-3xl">
                          {e.workshop.title}
                        </h3>

                        <div className=" text-md rounded-full md:rounded-sm  md:text-md    lg:text-xl px-3 py-2 bg-[#F2E9F9] text-[#6B6B6B] w-fit flex items-center gap-3 shadow-sm shadow-black/5">
                          <span className="inline-block font-normal">
                            Date-
                          </span>
                          <h3 className="inline-block font-bold ">
                            {formattedDate}
                          </h3>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-[#827B70] text-sm md:text-lg flex items-center gap-2 font-medium">
                            <span>
                              <Image
                                src={"/image/svg/address.svg"}
                                alt="address"
                                height={40}
                                width={40}
                              />
                            </span>
                            <span>{e.workshop.location.address}</span>
                          </p>
                        </div>
                      </div>
                      <div className=" px-4  ">
                        <span className="bg-primary w-full text-white px-6 rounded-full py-2 font-open-sauce text-xl ">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="online tutorial">
            <div className=" grid grid-cols-1 bg-[#FFFBF4] rounded-[30px] md:grid-cols-3 ">
              {data.tutorialAccess.map((e, i) => {
                return (
                  <Link key={i} href={`/online-tutorials/${e.id}/video-play`}>
                    <div
                    
                    className=" w-full flex flex-col gap-5  px-4 py-4"
                  >
                    <div className=" relative">
                      <Image
                        alt={e.tutorial.title}
                        className=" w-full max-h-[250px] md:max-h-64 object-cover md:object-center  rounded-[30px]"
                        height={100}
                        width={100}
                        src={e.tutorial.thumbnail}
                      />
                    </div>
                    <div className="flex flex-col gap-6 items-center md:items-start justify-between w-full">
                      <div className="flex flex-col gap-2 md:gap-4">
                        <h3 className="font-open-sauce text-center md:text-left font-bold text-[#656565] text-xl md:text-3xl">
                          {e.tutorial.title}
                        </h3>
                        <span className="bg-primary w-fit text-white px-6 rounded-full py-1 font-open-sauce text-xl ">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                );
                  </div>
              })}
            </div>
          </TabsContent>
          <TabsContent value="Regular Class">
            <div className="flex col w-full gap-4">
              {data.userSubscription.map((e, i) => {
                const formattedDate = format(
                  e.class.startDate,
                  "do MMM yyyy | h b",
                ).toUpperCase();
                return (
                  <div
                    key={i}
                    className="bg-[#FFFBF4] w-full flex flex-col md:flex-row gap-5 rounded-[30px] px-4 py-4"
                  >
                    <div className=" relative">
                      <Image
                        alt={e.class.title}
                        className=" w-full md:w-64 max-h-[250px] md:max-h-42 object-cover md:object-center  rounded-[30px]"
                        height={100}
                        width={100}
                        src={e.class.thumbnail}
                      />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between w-full">
                      <div className="flex flex-col gap-2 md:gap-4">
                        <h3 className="font-open-sauce text-center md:text-left font-bold text-[#656565] text-xl md:text-3xl">
                          {e.class.title}
                        </h3>

                        <div className=" text-md rounded-full md:rounded-sm  md:text-md    lg:text-xl px-3 py-2 bg-[#F2E9F9] text-[#6B6B6B] w-fit flex items-center gap-3 shadow-sm shadow-black/5">
                          <span className="inline-block font-normal">
                            Date-
                          </span>
                          <h3 className="inline-block font-bold ">
                            {formattedDate}
                          </h3>
                        </div>
                        <div className="hidden md:block"></div>
                      </div>
                      <div className=" px-4  ">
                        <span className="bg-primary w-full text-white px-6 rounded-full py-2 font-open-sauce text-xl ">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfileContainer;
