import { NextResponse } from "next/server";
import { Post } from "@/redux/types";
import { dbConnect } from "@/utilities/db";
import PostModel from "@/dbModels/Posts";

export const POST = async (req: Request) => {
  const data = await req.json();

  dbConnect();

  //   //  console.log(data, "data.........");
  try {
    const found = await PostModel.find();
    // //  console.log(found, "found daaataa");
    if (found.length > 0) {
      const deleted = await PostModel.deleteMany();
      //   //  console.log(deleted, "delete successfull");

      const saved = await PostModel.insertMany(data);

      //   const saved = await upload.save();

      if (saved) {
        // //  console.log("data is saved....");
        return NextResponse.json(
          { message: "Created after deleting old data...", saved: saved },
          { status: 201 }
        );
      }
    }

    const saved = await PostModel.insertMany(data);

    if (saved) {
      //   //  console.log("data is saved....");
      return NextResponse.json(
        { message: "Created", saved: saved },
        { status: 201 }
      );
    }
  } catch (err) {
    // //  console.log("error in saving", err);
    return NextResponse.json(
      { message: "failed", error: err },
      { status: 500 }
    );
  }
};
