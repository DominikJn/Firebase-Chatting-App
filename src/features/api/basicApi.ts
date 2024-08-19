import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const basicApi = createApi({
  baseQuery: fakeBaseQuery(),
  endpoints: () => ({}),
});
