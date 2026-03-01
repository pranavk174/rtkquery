import { createYoga, createSchema } from "graphql-yoga";
import { readFileSync } from "fs";
import path from "path";
import GraphQLJSON from "graphql-type-json";
import fs from "fs/promises";
import crypto from "crypto";

import { dbConnect } from "@/utilities/db";
import ProductModel from "@/dbModels/ProductModels";

const typeDefs = readFileSync(
  path.join(process.cwd(), "src/graphqlSChema/product.schema.gql"),
  "utf8",
);

const buildDbFilter = (
  category: string,
  brand: string,
  title: string,
  cursor: string | null,
) => {
  const filter: any = {};
  if (category !== "All") {
    filter.category = category;
  }

  if (title !== "All") {
    filter.title = title;
  }

  if (brand !== "All") {
    filter.brand = brand;
  }

  if (cursor !== null) {
    filter._id = { $gt: cursor };
  }

  return filter;
};

const schema = createSchema({
  typeDefs,
  resolvers: {
    JSON: GraphQLJSON, // 🔥 THIS LINE IS IMPORTANT

    Query: {
      getProducts: async (
        _,
        {
          skip = 10,
          limit = 10,
          category = "All",
          brand = "All",
          cursor = null,
          title = "All",
        },
      ) => {
        try {
          await dbConnect();

          const filter = buildDbFilter(category, brand, title, cursor);

          // const products = await ProductModel.find(filter).limit(limit).skip(skip + 1).lean()

          const [data, total, categories, brands, titles] = await Promise.all([
            ProductModel.find(filter)
              .sort({ _id: 1 })
              .limit(limit + 1),
            ProductModel.countDocuments(filter),
            ProductModel.distinct("category"),
            ProductModel.distinct("brand"),
            ProductModel.distinct("title"),
          ]);
          const products = data;

          const res = await ProductModel.find(filter)
            .sort({ _id: 1 })
            .limit(limit + 1);

          console.log(res, "prodctsssssssss", products, filter);

          const hasMore = products.length > limit;

          // sirf limit tak return karo
          const slicedData = hasMore ? products.slice(0, limit) : products;

          // cursor = extra fetched item ka _id
          const nextCursor = hasMore ? products[limit]._id.toString() : null;

          if (
            data.length === 0 ||
            !total ||
            categories.length === 0 ||
            brands.length === 0 ||
            titles.length === 0
          ) {
            return {
              message: "No products found matching the criteria",
              products: [],
              total: 0,
              categories: categories || [],
              brands: brands || [],
              titles: titles || [],
              hasMore: false,
            };
          }

          return {
            message: "Products fetched successfully",
            total: total || 0,
            nextCursor: nextCursor || null,

            categories: categories ?? [],
            titles: titles ?? [],
            products: slicedData ?? [],
            hasMore: hasMore,
          };
        } catch (err) {
          return { message: "Some thing went Wrong", status: 500 };
        }
      },
    },
    Mutation: {
      uploadProducts: async (_, { body }) => {
        try {
          console.log(body);

          const data = await ProductModel.find();
          if (data.length > 0) {
            const deleted = await ProductModel.deleteMany();
          }

          const uploaded = await ProductModel.insertMany(body);
          if (!uploaded) {
            return {
              message: "Something went Wrong",
              status: 500,
            };
          }
          return {
            message: "Uploaded Successfully",
            status: 201,
          };
        } catch (err) {
          console.log(err, "error.......");
          return {
            message: "Something went Wrong",
            status: 500,
          };
        }
      },
      createProduct: async (_, { body }) => {
        try {
          const data = await ProductModel.insertOne(body);
          if (!data) {
            return {
              message: "Something went wrong",
              status: 500,
            };
          }
          return {
            message: "Inserted Successfully",
            status: 201,
          };
        } catch (err) {
          return {
            message: "Something went wrong",
            status: 500,
          };
        }
      },
      startUpload: async () => {
        try {
          const uploadId = crypto.randomUUID();
          await fs.mkdir(`upload/${uploadId}`, { recursive: true });
          return { uploadId, chunkSize: 1024 * 1024 };
        } catch (error) {
          return {
            message: "Some thing went wrong in uploading chunk",
            status: 500,
          };
        }
      },
      cancelUpload: async (_, { uploadId }) => {
        try {
          await fs.rm(`upload/${uploadId}`, {
            recursive: true,
            force: true,
          });

          return { message: "Cancel Upload Succeeeded", status: 200 };
        } catch (err) {
          console.log(err, "err");
          return { message: "Cancel Upload Failed", status: 500 };
        }
      },
      finishUpload: async (_, { uploadId, extension }) => {
        try {
          const folderPath = `upload/${uploadId}`;

          const parts = await fs.readdir(folderPath);

          const finalPath = `upload/${uploadId}-${Date.now()}.${extension}`;
          const finalFile = await fs.open(finalPath, "w");

          for (const p of parts.sort((a, b) => Number(a) - Number(b))) {
            const buf = await fs.readFile(`upload/${uploadId}/${p}`);
            await finalFile.write(buf);
          }

          await finalFile.close();
          await fs.rm(folderPath, { recursive: true, force: true });
          return {
            message: "succesfully finish upload",
            status: 201,
          };
        } catch (error) {
          return {
            message: "error in finish upload",
            status: 500,
          };
        }
      },
    },
  },
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql/product",
});

export { yoga as GET, yoga as POST };
