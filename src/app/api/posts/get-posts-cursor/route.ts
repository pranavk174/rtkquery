import { dbConnect } from "@/utilities/db";
import { NextResponse } from "next/server";
import PostModel from "@/dbModels/Posts";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit")) || 10;
    // const skip = Number(searchParams.get("skip")) || 0;
    const cursor = searchParams.get('cursor')
    const type = searchParams.get("type");

    console.log(typeof type, "skiup data.......", type);
    dbConnect();

    if (!type) {
      return NextResponse.json(
        { message: "type is required" },
        { status: 400 }
      );
    }

    const filter: any = {}


    if (type !== "All") {
      filter.type = type;   // normal filter
    }
    if (cursor) {
      ``
      filter._id = { $gt: cursor };
    }


    // const posts = await PostModel.find(filter).sort({ _id: 1 }).limit(limit + 1)
    const posts = await PostModel
      .find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1);

    if (posts.length === 0) {
      return NextResponse.json({
        message: "database is empty",
        success: false,
        status: 501
      })
    }

    const hasMore = posts.length > limit
    // console.log(hasMore, "hasmore.....")

    const slicedPosts = hasMore ? posts.slice(0, limit) : posts;
    // console.log(slicedPosts, "sclied prostssss")
    const nextCursor = hasMore ? slicedPosts[slicedPosts.length - 1]._id : null



    return NextResponse.json(
      {
        message: "success",
        posts: slicedPosts,
        nextCursor,
        hasMore,
      },
      { status: 200 }
    );


  } catch (err) {
    console.log(err, "error message");
    return NextResponse.json({ message: "Someething went Wrong", error: err });
  }
};
