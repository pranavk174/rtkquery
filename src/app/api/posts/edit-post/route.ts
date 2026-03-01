import { NextRequest, NextResponse } from "next/server";

import PostModel from "@/dbModels/Posts";
import { dbConnect } from "@/utilities/db";

export const PUT = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const bodyD = await req.json();
    if (!bodyD || !id) {
      return NextResponse.json({
        mesage: "Body or id data is empty, chek payload..",
      });
    }
    dbConnect();
    const data = await PostModel.findById(id);
    if (!data) {
      return NextResponse.json({
        message: "data does not exist",
      });
    }

    const { title, body, tags, views } = bodyD;

    data.body = body;
    data.title = title;

    const updated = await data.save();

    if (!updated) {
      return NextResponse.json({ messsage: "update failed.... " });
    }
    return NextResponse.json({ messsage: "updated succesfully " });
  } catch (errr) {
    return NextResponse.json({
      message: "Internal server Error",
      error: errr,
    });
  }
};


export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        status: 400,
        message: "Id not available",
        success: false

      })


    }
    dbConnect();
    const found = await PostModel.findById(id)
    if (!found) {
      return NextResponse.json({
        message: 'Post Does not Exist',
        status: 404,
        success: false
      })
    }
    const deleted = await PostModel.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({
        message: 'Something went wrong',
        status: 500,
        success: false
      })
    }
    return NextResponse.json({
      message: 'Successfullly Deleted',
      status: 201,
      success: true
    })

  } catch (error) {

  }
}
