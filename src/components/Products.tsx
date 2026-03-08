"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
// import ProductsData from "../products.json";
import { FixedSizeList } from "react-window";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  useAddProductsMutation,
  // useGetProductsQuery,
} from "@/redux/services/apiServices";
import { Product, productResponse } from "@/redux/types";
import { useGetProductsQuery } from "@/redux/services/graphqlAPi";
import ProductCard from "./ProductCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDebounce } from "@/utilities/hooks";
import Modal from "./Modal";
import { prefillCacheAndPreventDuplicates } from "@/utilities/cacheHydration";

interface ProductsProps {
  initialProducts: productResponse;
}

const Products: React.FC = () => {
  // State management
  const [limit, setLimit] = useState<number>(12);
  const [skip, setSkip] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Debounced search
  const debouncedTitle = useDebounce(search, 500);

  // Mutations
  const [addProducts] = useAddProductsMutation();
  const divRef = useRef<HTMLDivElement | null>(null);

  const [cursor, setCursor] = useState(null);

  const handleTrigger = () => {
    const mu = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        return setCursor(apiData.nextCursor);
      }
    });
  };

  // Memoize query arguments to prevent unnecessary re-renders
  const queryArgs = useMemo(
    () => ({
      limit,
      skip,
      category: selectedCategory ?? "All",
      brand: selectedBrand ?? "All",
      title: debouncedTitle ?? "All",
      cursor: cursor ?? null,
    }),
    [limit, skip, selectedCategory, selectedBrand, debouncedTitle],
  );

  // Check if this is the initial SSR query (no filters applied)
  const isInitialSSRQuery = useMemo(() => {
    return (
      limit === 12 &&
      skip === 0 &&
      !selectedCategory &&
      !selectedBrand &&
      !debouncedTitle
    );
  }, [limit, skip, selectedCategory, selectedBrand, debouncedTitle]);

  const {
    data: apiData,
    isLoading,
    isFetching,
    error,
    isSuccess,
  } = useGetProductsQuery(queryArgs);

  const products = apiData?.products ?? [];
  const categories = apiData?.categories ?? [];
  const brands = apiData?.brands ?? [];
  const titles = apiData?.titles ?? [];
  const total = apiData?.total ?? 0;
  const hasMore = apiData?.hasMore ?? false;

  // Event handlers
  const handleAddProducts = async () => {
    try {
      // await addProducts(ProductsData.products).unwrap();
      //  console.log("✅ Products uploaded successfully");
    } catch (error) {
      console.error("❌ Failed to upload products:", error);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearch(null);
    setLimit(12);
    setSkip(0);
  };

  const handlePrevPage = () => {
    setSkip((prev) => Math.max(0, prev - limit));
  };

  const handleNextPage = () => {
    setSkip((prev) => prev + limit);
  };

  // Loading state
  const showLoading = (isLoading || isFetching) && !isInitialSSRQuery;

  // Debug logging
  //  console.log("🔍 Products Component State:", {
  apiData,
  });

useEffect(() => {
  if (!divRef.current) return;
  // if (!apiData?.nextCursor) return; // 👈 stop when no more data
  //  console.log("triggereddddddd");

  const observer = new IntersectionObserver((entries) => {
    if (
      entries[0].isIntersecting &&
      !isFetching &&
      apiData?.nextCursor !== null
    ) {
      setCursor(() => apiData?.nextCursor);
    }
  });

  if (divRef.current) observer.observe(divRef.current);

  return () => observer.disconnect();
}, [apiData?.nextCursor, cursor]);

return (
  <div className="">
    {/* Controls */}
    <div className="flex items-center justify-between bg-green-400 relative p-4 mb-4">
      <Button
        onClick={handleAddProducts}
        size="sm"
        className="text-white"
        variant="outline"
      >
        Upload Products
      </Button>

      <Select
        onValueChange={setSelectedCategory}
        value={selectedCategory ?? "data"}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {categories?.map((cat: any) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleReset} size="sm" variant="outline">
        Reset Filter <span>Clear data</span>
      </Button>

      <div className="max-w-[200px]">
        <Input
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
      </div>
    </div>

    {/* Loading State */}
    {showLoading && (
      <div className="flex justify-center items-center py-8">
        <div className="text-white">Loading products...</div>
      </div>
    )}

    {/* Error State */}
    {error && (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error loading products: {error.toString()}
        </div>
      </div>
    )}

    {/* Products Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 max-h-[750px] h-full overflow-y-auto">
      {products.length > 0
        ? products.map((product: any, idx: number) => {
          const isLast = idx === products.length - 1;

          return (
            <div
              key={product._id ?? idx}
              ref={isLast ? divRef : null} // 👈 move sentinel
            >
              <ProductCard product={product} />
            </div>
          );
        })
        : !showLoading && (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="text-white">No products found</div>
          </div>
        )}
    </div>

    {/* Pagination */}
    <div className="w-full flex justify-center gap-5 mt-5 text-white">
      <Button
        className="bg-blue-500 px-4 py-2 text-white"
        onClick={handlePrevPage}
        disabled={skip <= 0 || showLoading}
      >
        Prev
      </Button>

      <div className="flex items-center px-4 py-2 bg-gray-700 rounded">
        {Math.floor(skip / limit) + 1} of {Math.ceil(total / limit) || 1}
      </div>

      <Button
        className="bg-blue-500 px-4 py-2 text-white"
        onClick={handleNextPage}
        disabled={skip + limit >= total || showLoading}
      >
        Next
      </Button>

      <Button
        className="bg-blue-500 px-4 py-2 text-white"
        onClick={() => setOpen(true)}
      >
        Open Modal
      </Button>
    </div>

    <Modal open={open} onClose={() => setOpen(false)} />
  </div>
);
};

export default Products;
