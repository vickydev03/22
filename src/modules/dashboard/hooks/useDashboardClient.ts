import {
  createLoader,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

const params = {
  page: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),
    
  limit: parseAsInteger
    .withDefault(10)
    .withOptions({ clearOnDefault: true }),

}

export const loadDashboardUserFilter = createLoader(params)
