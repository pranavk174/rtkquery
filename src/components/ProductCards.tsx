import { Product } from "@/redux/types";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const images = [
    "https://picsum.photos/id/1018/600/300",
    "https://picsum.photos/id/1015/600/300",
    "https://picsum.photos/id/1019/600/300",
  ];

  const [index, setIndex] = useState<number>(0);
  const handleNext = () => {
    setIndex((p) => (index === images?.length - 1 ? 0 : p + 1));
  };
  const prevSlide = () => {
    setIndex((prev) => (index === 0 ? images?.length - 1 : prev - 1));
  };

  const slider = {
    display: "flex",
    transition: "transform 0.5s ease-in-out",
  };

  // //  console.log(product, "thumbnaillll");
  return (
    <div className="w-full  rounded-xl border  bg-white shadow-sm p-4 space-y-3">
      {/* Thumbnail */}
      {/* {product.thumbnail && (
        <img
          src={images[0]}
          alt={product.title}
          className="h-48 w-full object-cover rounded-lg"
        />
      )} */}

      <div className="w-full overflow-hidden relative  rounded-md ">
        <div
          className="flex transition-all relative w-full duration-300 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >

          {product.images && product?.images?.length === 0 ? <div className="animate-pulse h-40 bg-gray-200 rounded" /> : (product?.images?.map((i, idx) => {
            return <div key={i} className="relative w-full h-[300px]">
              <Image
                src={i}
                fill
                priority={true}
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 300px"
                alt="product"
              />
            </div>
          }))}


          {/* {product?.images?.map((i, idx) => {
            return <Image className="object-cover" fill src={i} key={i} alt="images" />;
          })} */}
        </div>
      </div>
      <div className=" w-full flex justify-center gap-5 mt-5 text-white">
        <Button
          className=" bg-blue-500 px-4 py-2  text-green-300"
          onClick={prevSlide}
        >
          Prev
        </Button>
        <Button
          className=" bg-blue-500 px-4 py-2 text-green-300"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>

      {/* Title + Status */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <span
          className={`text-xs px-2 py-1 rounded-full ${product.availabilityStatus === "In Stock"
            ? "bg-green-100 text-green-700"
            : product.availabilityStatus === "Low Stock"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {product.availabilityStatus}
        </span>
      </div>

      {/* Category & Brand */}
      <p className="text-sm text-gray-500">
        {product.category} {product.brand && `• ${product.brand}`}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">₹{product.price}</span>
        {product.discountPercentage && (
          <span className="text-sm text-green-600">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-gray-600 min-h-[60px] line-clamp-3">
          {product.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        {product.sku && <p>SKU: {product.sku}</p>}
        {product.weight && <p>Weight: {product.weight}kg</p>}
        {product.stock && <p>Stock: {product.stock}</p>}
        {product.minimumOrderQuantity && (
          <p>MOQ: {product.minimumOrderQuantity}</p>
        )}
      </div>

      {/* Dimensions */}
      {product.dimensions && (
        <p className="text-xs text-gray-600">
          Size: {product.dimensions.width} × {product.dimensions.height} ×{" "}
          {product.dimensions.depth}
        </p>
      )}

      {/* Tags */}
      {product.tags && (
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="border-t pt-2">
          <p className="text-sm font-medium">
            ⭐ {product.reviews[0].rating} / 5
          </p>
          <p className="text-xs text-gray-500">{product.reviews[0].comment}</p>
        </div>
      )}
    </div>
  );
}
