import { NextResponse } from "next/server";
import ProductModel from "@/dbModels/ProductModels";
import { dbConnect } from "@/utilities/db";

export const POST = async (req: Request) => {
  try {
    dbConnect();
    const payload = await req.json();
    if (!payload) {
      return NextResponse.json(
        {
          message: "Payload data is blank",
        },
        { status: 500 }
      );
    }
    const data = await ProductModel.find();
    if (data.length > 0) {
      const deleted = await ProductModel.deleteMany();
      if (!deleted) {
        return NextResponse.json(
          {
            message: "Deletion failed",
          },
          { status: 500 }
        );
      }
      const uploaded = await ProductModel.insertMany(payload);
      if (!uploaded) {
        return NextResponse.json(
          {
            message: "Data uploading failed",
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          message: "Data Insertion Succesfull",
        },
        { status: 201 }
      );
    }
    const uploaded = await ProductModel.insertMany(payload);
    if (!uploaded) {
      return NextResponse.json(
        {
          message: "Data uploading failed",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "Data Insertion Succesfull",
      },
      { status: 201 }
    );
  } catch (err) {
    // //  console.log(err, "error.....");
    return NextResponse.json(
      {
        message: "Data uploading failed",
        error: err,
      },
      { status: 500 }
    );
  }
};
