import { createYoga, createSchema } from 'graphql-yoga';
import { readFileSync } from 'fs';

import path from "path"


import { dbConnect } from '@/utilities/db';
import PostModel from '@/dbModels/Posts';

const typeDefs = readFileSync(
    path.join(process.cwd(), 'src/graphqlSChema/post.schema.gql'), 'utf8'
)


const schema = createSchema({
    typeDefs,
    resolvers: {
        Query: {
            getPosts: async (_, { limit = 10, skip = 10, cursor = null, type = 'All' }) => {

                try {
                    await dbConnect()
                    const filter: any = {}
                    if (type !== "All") {
                        filter.type = type;   // normal filter
                    }
                    if (cursor) {
                        ``
                        filter._id = { $gt: cursor };
                    }
                    const posts = await PostModel.find(filter).sort({ _id: 1 })
                        .limit(limit + 1);
                    const hasMore = posts.length > limit

                    const slicedPost = hasMore ? posts.slice(0, limit) : posts
                    const nextCursor = hasMore ? slicedPost[slicedPost.length - 1]._id.toString() : null;

                    const total = await PostModel.countDocuments(filter);
                    if (posts.length === 0) {
                        return {
                            posts: [],
                            total: 0,
                            nextCursor: null,
                            hasMore: false,
                            message: 'Posts data is empty , Please Insert ',
                        }
                    }

                    return {
                        posts: slicedPost, total,
                        nextCursor, hasMore, message: "Succesfully retrieved data"
                    }
                }
                catch (err) {
                    //  console.log(err)
                    return {
                        error: err,
                        message: "error some thing wrong",
                        status: 500
                    }
                }
            }
        },
        Mutation: {
            deletePost: async (_, { id }) => {
                try {
                    await dbConnect()
                    const deleted = await PostModel.findByIdAndDelete(id)
                    if (!deleted) {
                        return {
                            message: "Something went Wrong",
                            status: 500
                        }
                    }
                    return {
                        message: "Deleted Successfully",
                        status: 200
                    }
                } catch (err) {
                    return {
                        message: "Something went Wrong",
                        status: 500,
                        error: err
                    }
                }
            }
        }
    }
})

const yoga = createYoga({
    schema, graphqlEndpoint: '/api/graphql/post'
});

export {
    yoga as GET, yoga as POST
}