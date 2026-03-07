import { dbConnect } from "@/utilities/db";
import { NextResponse } from "next/server";
import PostModel from "@/dbModels/Posts";

export const GET = async (req: Request) => {
  try {

    const { searchParams } = new URL(req.url);

    const limit = Number(searchParams.get("limit")) || 10;
    const skip = Number(searchParams.get("skip")) || 0;
    const type = searchParams.get("type");

    //  console.log(typeof type, "skiup data.......", type);
    await dbConnect();

    if (!type) {
      return NextResponse.json(
        { message: "type is required" },
        { status: 400 }
      );
    }

    if (type === "All") {
      const data = await PostModel.find({}).skip(skip).limit(limit);
      const total = await PostModel.find();

      if (data) {
        if (data.length > 0) {
          return NextResponse.json(
            {
              message: "succesfully got the data",
              posts: data,
              total: total.length,
            },
            { status: 200 }
          );
        }
        return NextResponse.json({ message: "data base is empty" });
      }
      return NextResponse.json({ message: "data not found" });
    }

    const data = await PostModel.find({
      [type]: { $exists: true },
    })
      .skip(skip)
      .limit(limit);

    const total = await PostModel.find();

    if (data) {
      if (data.length > 0) {
        return NextResponse.json(
          {
            message: "succesfully got the data",
            posts: data,
            total: total.length,
          },
          { status: 200 }
        );
      }
      return NextResponse.json({ message: "data base is empty" });
    }
    return NextResponse.json({ message: "data not found" });
  } catch (err) {
    //  console.log(err, "error message");
    return NextResponse.json({ message: "Someething went Wrong", error: err });
  }
};
