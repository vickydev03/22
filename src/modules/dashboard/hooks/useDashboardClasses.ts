// "use client";
// import { DEFAULT_PAGE } from "@/constant";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
// import {} from "nuqs/server";
const params = {
  page: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),
    
  limit: parseAsInteger
    .withDefault(10)
    .withOptions({ clearOnDefault: true }),

}

export const useDashboardUserFilters = () => {
  return useQueryStates(params);
};
