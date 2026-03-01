import { configureStore } from "@reduxjs/toolkit";
import { postsApi, productApi } from "./services/apiServices";
import { gqlpostApi, productApigql } from "./services/graphqlAPi";

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
    [gqlpostApi.reducerPath]: gqlpostApi.reducer,
    [productApigql.reducerPath]: productApigql.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware, productApi.middleware, gqlpostApi.middleware, productApigql.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
