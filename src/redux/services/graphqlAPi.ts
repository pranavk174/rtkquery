import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../types";

export const gqlpostApi = createApi({
  reducerPath: "PostApii",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/graphql/post",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ limit = 10, skip = 0, type = "All", cursor = null }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
                    query GetPosts($limit: Int, $skip: Int, $cursor: String, $type: String){
                    getPosts(limit: $limit, skip: $skip, type: $type, cursor: $cursor){
                    message
                    total
                    nextCursor
                    hasMore
                    posts{
                    _id
                    title
                    body
                    tags
                    views
                    }}
                    }`,
          variables: { limit, skip, cursor, type },
        },
      }),
      providesTags: ["Posts"],
      transformResponse: (response: any) => response.data.getPosts,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newData) => {
        currentCache.posts.push(...newData.posts);
        currentCache.nextCursor = newData.nextCursor;
        currentCache.hasMore = newData.hasMore;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor;
      },
    }),
  }),
});

export const { useGetPostsQuery } = gqlpostApi;

export const productApigql = createApi({
  reducerPath: "ProductApigql",
  baseQuery: fetchBaseQuery({
    baseUrl: "api/graphql/product",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        limit = 10,
        category = "All",
        cursor = null,
        title = "All",
        brand = "All",
      }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
                    query GetProducts($limit:Int , $skip:Int, $category:String,$title:String ,$cursor: String,$brand:String){
                  getProducts(
  skip: $skip,
  title: $title,
  cursor: $cursor,
  category: $category,
  limit: $limit,
  brand: $brand
)
{
                    message
                    total
                    categories
                              hasMore
                    titles
                    nextCursor
          
                    products{
                    _id
                    availabilityStatus
    brand
    category
    description
 

    images
  discountPercentage
  dimensions {
  depth
}

meta {
  createdAt
  barcode
}

reviews {
  comment
  rating
}


    shippingInformation
    sku
    tags
    thumbnail
    title
    warrantyInformation
    weight
      minimumOrderQuantity
  price
  returnPolicy
                    }
                    }
                    
                    }`,
          variables: { limit, category, cursor, brand, title },
        },
      }),
      providesTags: ["Product"],
      transformResponse: (response: any) => {
        console.log(response.data.getProducts, "=========hsfhklsdhfsdfhsdkf");

        return response.data.getProducts;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { category, title, brand } = queryArgs;
        return `${endpointName}-${category}-${title}-${brand}`;
      },

      merge: (currentCache, newData) => {
        console.log("new data", newData, currentCache);
        currentCache.products.push(...newData.products);
        currentCache.nextCursor = newData.nextCursor;
        currentCache.hasMore = newData.hasMore;
        currentCache.categories = newData.categories;
        currentCache.titles = newData.titles;
        currentCache.total = newData.total;
      },

      forceRefetch({ currentArg, previousArg }) {
        console.log(currentArg.previousArg, "prwevious argsssss", previousArg);
        return currentArg?.cursor !== previousArg?.cursor;
      },
    }),

    uploadProducts: builder.mutation({
      query: (body) => (
        console.log(body, "body data....."),
        {
          url: "",
          method: "POST",
          body: {
            query: `
                   mutation uploadProducts($body: JSON){
  uploadProducts(body:$body){
    message
    status
  }
}`,
            variables: { body },
          },
        }
      ),
    }),
    createProduct: builder.mutation({
      query: ({ body }) =>
        // console.log(formData, "formdata..."),
        ({
          url: "",
          method: "POST",
          body: {
            query: `
                mutation createProduct($body: JSON){
                createProduct(body:$body){
                
                message
                status
                
                }}`,
            variables: { body },
          },
        }),
    }),
    startUpload: builder.mutation({
      query: () => ({
        url: "",
        method: "POST",
        body: {
          query: `
        mutation {startUpload{
        uploadId
        chunkSize}}`,
        },
      }),
    }),
    cancelUpload: builder.mutation({
      query: ({ uploadId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
        mutation cancelUpload($uploadId: String!){
        cancelUpload(uploadId:$uploadId){
        message
        status
        }
        }
        `,
          variables: { uploadId: uploadId },
        },
      }),
    }),
    finishUpload: builder.mutation({
      query: ({ uploadId, extension }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
        mutation finishUpload($uploadId:String! , $extension:String!){
        finishUpload(uploadId:$uploadId , extension:$extension){
        message
        status}
        }
        `,
          variables: { uploadId, extension },
        },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useUploadProductsMutation,
  useCreateProductMutation,
  useStartUploadMutation,
  useCancelUploadMutation,
  useFinishUploadMutation,
} = productApigql;
