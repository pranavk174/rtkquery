import { Schema } from "mongoose";
import mongoose from "mongoose";
const productSchema = new Schema({
  availabilityStatus: {
    type: String,
    // required: true,
    // enum: {
    //   values: ["In Stock", "Low Stock", "Out Of Stock"],
    //   message: "availabilityStatus must be either 'in_stock' or 'out_of_stock'",
    // },
  },
  brand: String,
  category: String,
  description: String,
  dimensions: {
    depth: Number,
    height: Number,
    width: Number,
  },
  discountPercentage: Number,
  images: [String],
  meta: {
    createdAt: String,
    updatedAt: String,
    barcode: String,
    qrCode: String,
  },
  minimumOrderQuantity: Number,
  price: Number,
  returnPolicy: String,
  reviews: [
    {
      comment: String,
      date: String,
      rating: Number,
      reviewerEmail: String,
      reviewerName: String,
    },
  ],
  shippingInformation: String,
  sku: String,
  tags: [String],
  thumbnail: String,
  title: String,
  warrantyInformation: String,
  weight: Number,
});

const ProductModel =
  mongoose.models.products || mongoose.model("products", productSchema);

export default ProductModel;
