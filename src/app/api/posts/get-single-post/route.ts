import { dbConnect } from "@/utilities/db";
import { NextResponse } from "next/server";
import PostModel from "@/dbModels/Posts";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    // //  console.log(limit, skip, "skiup data.......");
    // //  console.log(typeof id, "type of id....");
    dbConnect();

    const data = await PostModel.findById(id);

    if (data) {
      return NextResponse.json(
        { message: "succesfully got the data", post: data },
        { status: 200 }
      );
    }
    return NextResponse.json({ message: "data not found" });
  } catch (err) {
    //  console.log(err, "error message");
    return NextResponse.json({ message: "Someething went Wrong", error: err });
  }
};
