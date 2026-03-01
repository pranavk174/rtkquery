import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  User,
  userProps,
  Post,
  PostsProps,
  Product,
  productResponse,
} from "../types";

// Cache hydration helper
interface HydrationAction {
  type: string;
  payload: any;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/posts/",
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<
      PostsProps,
      { limit: number; skip: number; type?: string }
    >({
      query: ({ limit, skip, type = "All" }) =>
        `get-posts?limit=${limit}&skip=${skip}&type=${type}`,

      providesTags: ["Post"],
    }),
    getCursorPosts: builder.query<
      PostsProps,
      { cursor: string | null; skip: number; type?: string }
    >({
      query: ({ cursor, skip, type = "All" }) =>
        `get-posts-cursor?skip=${skip}&type=${type}&cursor=${cursor || ""}`,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newData) => {
        currentCache.posts.push(...newData.posts);
        currentCache.nextCursor = newData.nextCursor;
        currentCache.hasMore = newData.hasMore;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
      providesTags: ["Post"],
    }),
    getPost: builder.query<Post, string>({
      query: (id) => `get-single-post?id=${id}`,
      providesTags: ["Post"],
    }),

    uploadPosts: builder.mutation<Post[], Post[]>({
      query: (payload) => ({ url: "/upload", method: "POST", body: payload }),
      invalidatesTags: ["Post"],
    }),
    editPost: builder.mutation<
      Post,
      { id: string; payload?: Post; method?: string }
    >({
      query: ({ id, payload, method }) => ({
        url: `/edit-post?id=${id}`,
        method: method,
        body: payload,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const productApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/products/",
  }),
  tagTypes: ["products"],
  // Add hydration support
  // extractRehydrationInfo(action: HydrationAction, { reducerPath }) {
  //   // Check if this is a hydration action from SSR
  //   if (action.type === 'HYDRATE_PRODUCTS') {
  //     return action.payload[reducerPath];
  //   }
  // },
  endpoints: (builder) => ({
    addProducts: builder.mutation<Response, Product[]>({
      query: (products) => ({
        url: `add-products`,
        method: "POST",
        body: products,
      }),
      invalidatesTags: ["products"],
    }),
    addProduct: builder.mutation<Response, Product[]>({
      query: (product) => ({
        url: `upload`,
        method: "POST",
        products: product,
      }),
      invalidatesTags: ["products"],
    }),
    uploadChunk: builder.mutation({
      query: ({ formdata, signal }) => ({
        url: `upload`,
        method: "POST",
        body: formdata,
        signal,
      }),
      invalidatesTags: ["products"],
    }),

    getProducts: builder.query<
      productResponse,
      {
        limit: number;
        skip: number;
        category?: string | null;
        brand?: string | null;
        title?: string | null;
      }
    >({
      query: ({ limit, skip, category = null, brand = null, title = null }) => {
        // Build query string properly handling null values
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("skip", skip.toString());

        if (category && category !== "null") {
          params.append("category", category);
        }
        if (brand && brand !== "null") {
          params.append("brand", brand);
        }
        if (title && title !== "null") {
          params.append("title", title);
        }

        return `get-products?${params.toString()}`;
      },
      transformResponse: (response: productResponse) => {
        const { titles, categories, brands, total, message, products } =
          response ?? {};
        return {
          message: message || "Products fetched successfully",
          products: products || [],
          categories: categories ?? [],
          brands: brands ?? [],
          titles: titles ?? [],
          total: total ?? 0,
        };
      },
      providesTags: ["products"],
      // Add cache key generation for proper hydration
      serializeQueryArgs: ({ queryArgs }) => {
        const { limit, skip, category, brand, title } = queryArgs;
        return `products-${limit}-${skip}-${category || "null"}-${brand || "null"}-${title || "null"}`;
      },
    }),
    getCategories: builder.query<string[], string[]>({
      query: () => `get-categories`,
      providesTags: ["products"],
    }),
    getBrands: builder.query<string[], string[]>({
      query: () => `get-brands`,
      providesTags: ["products"],
    }),
    getTitles: builder.query<string[], string[]>({
      query: () => `get-titles`,
      providesTags: ["products"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetCursorPostsQuery,
  useLazyGetCursorPostsQuery,
  useLazyGetPostQuery,
  useUploadPostsMutation,
  useEditPostMutation,
} = postsApi;

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetTitlesQuery,
  useAddProductsMutation,
  useGetBrandsQuery,
  useAddProductMutation,
  useUploadChunkMutation,
} = productApi;

// Export utility functions for cache management
export const { util: productApiUtil } = productApi;
