'use client'
import { useState } from "react";
import { Button } from "./ui/button";
import { useCreateProductMutation } from "@/redux/services/graphqlAPi";
import { Product } from "@/redux/types";
const emptyProduct = {
    title: "",
    category: "",
    brand: "",
    price: 0,
    discountPercentage: 0,
    availabilityStatus: "In Stock",
    description: "",
    sku: "",
    weight: 0,
    stock: 0,
    minimumOrderQuantity: 1,
    dimensions: {
        width: 0,
        height: 0,
        depth: 0,
    },
    tags: [] as string[],
    reviews: [
        {
            rating: 0,
            comment: "",
        },
    ],
    images: [] as string[],
};

export default function ProductForm() {
    const [product, setProduct] = useState<Product>(emptyProduct);

    const [createProduct, { isLoading, error }] = useCreateProductMutation();

    const handleClick = async (e: any) => {
        e.preventDefault();

        try {
            await createProduct({ body: product }).unwrap();

            console.log("Product created");
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (key: string, value: any) => {
        setProduct((prev) => ({ ...prev, [key]: value }));
    };

    const handleDimension = (key: string, value: number) => {
        setProduct((prev) => ({
            ...prev,
            dimensions: { ...prev.dimensions, [key]: value },
        }));
    };



    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">

            <h2 className="text-xl font-semibold">Add Product</h2>

            <input
                className="border p-2 rounded w-full"
                placeholder="Title"
                value={product.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
                <input
                    className="border p-2 rounded"
                    placeholder="Category"
                    value={product.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                />
                <input
                    className="border p-2 rounded"
                    placeholder="Brand"
                    value={product.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Price"
                    value={product.price}
                    onChange={(e) => handleChange("price", +e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Discount %"
                    value={product.discountPercentage}
                    onChange={(e) => handleChange("discountPercentage", +e.target.value)}
                />
            </div>

            <select
                className="border p-2 rounded w-full"
                value={product.availabilityStatus}
                onChange={(e) => handleChange("availabilityStatus", e.target.value)}
            >
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
            </select>

            <textarea
                className="border p-2 rounded w-full"
                rows={3}
                placeholder="Description"
                value={product.description}
                onChange={(e) => handleChange("description", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
                <input
                    className="border p-2 rounded"
                    placeholder="SKU"
                    value={product.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Weight"
                    value={product.weight}
                    onChange={(e) => handleChange("weight", +e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Stock"
                    value={product.stock}
                    onChange={(e) => handleChange("stock", +e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="MOQ"
                    value={product.minimumOrderQuantity}
                    onChange={(e) => handleChange("minimumOrderQuantity", +e.target.value)}
                />
            </div>

            <div className="grid grid-cols-3 gap-3">
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Width"
                    value={product.dimensions.width}
                    onChange={(e) => handleDimension("width", +e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Height"
                    value={product.dimensions.height}
                    onChange={(e) => handleDimension("height", +e.target.value)}
                />
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Depth"
                    value={product.dimensions.depth}
                    onChange={(e) => handleDimension("depth", +e.target.value)}
                />
            </div>

            <input
                className="border p-2 rounded w-full"
                placeholder="Tags (comma separated)"
                onChange={(e) =>
                    handleChange(
                        "tags",
                        e.target.value.split(",").map((t) => t.trim())
                    )
                }
            />

            <input
                type="number"
                step="0.1"
                className="border p-2 rounded w-full"
                placeholder="Rating"
                value={product.reviews[0].rating}
                onChange={(e) =>
                    setProduct((p) => ({
                        ...p,
                        reviews: [{ ...p.reviews[0], rating: +e.target.value }],
                    }))
                }
            />

            <textarea
                className="border p-2 rounded w-full"
                rows={2}
                placeholder="Review"
                value={product.reviews[0].comment}
                onChange={(e) =>
                    setProduct((p) => ({
                        ...p,
                        reviews: [{ ...p.reviews[0], comment: e.target.value }],
                    }))
                }
            />

            <input
                className="border p-2 rounded w-full"
                placeholder="Image URLs (comma separated)"
                onChange={(e) =>
                    handleChange(
                        "images",
                        e.target.value.split(",").map((i) => i.trim())
                    )
                }
            />

            <Button onClick={handleClick} className="bg-blue-600 text-white w-full">
                Save Product
            </Button>
        </div>
    );
}
