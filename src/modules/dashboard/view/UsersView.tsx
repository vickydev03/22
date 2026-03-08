"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { DataTable } from "../component/DataTable";
import { userColumn } from "../component/UserColumn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useDashboardUserFilters } from "../hooks/useDashboardClasses";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useRouter } from "next/navigation";

function UsersView() {
  const [filters, setFilters] = useDashboardUserFilters();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.user.getAllUser.queryOptions({ ...filters }),
  );
  
  const router=useRouter()
  const handleRowClick=(strr:string)=>{
    console.log("pressed")
    router.push(`/dashboard/users/${strr}`)
  }
  const totalPages=data.pagination.totalPages
  return (

    <div className="w-full h-full">
          <div className="absolute left-[50%] bottom-0">
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
      <div className="w-full px-5 lg:px-20 py-5 ">

        <div className="flex justify-between">
          <div className="font-semibold text-lg md:text-3xl text-[#656565]">
            Users
          </div>
          <div className="">
            <Button className="bg-primary text-xs md:text-sm capitalize px-4 lg:py-2">
              Add Users
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <DataTable
            columns={userColumn}
            data={data.users}
            name="users"
            onRowClick={handleRowClick}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>

  );
}

export default UsersView;
