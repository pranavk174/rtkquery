
import {
    User,
    userProps,
    Post,
    PostsProps,
    Product,
    productResponse,
} from "../redux/types";
export const fetchProducts = async (limit = 10, skip = 0) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/get-products?limit=${limit}&skip=${skip}`,
            { cache: "no-store" } // 👈 SSR duplicate & stale fix
        )

        // const res = await fetch("https://dummyjson.com/products?limit=194");
        if (!res.ok) {
            //  console.log(res, "response....")
            // throw new Error("Failed to fetch products")
        }

        const data = await res.json()

        //  console.log(data, "==================data==============")
        return data

    } catch (error) {
        //  console.log("Fetch products failed:===================>>>>>>>>>>><<<<<<<<<<<<<<<", error)
        return null
    }
}



export const fetchPosts = async (limit = 10, skip = 0) => {
    try {

        const res = await fetch(`http://localhost:3000/api/posts/get-posts?limit=${limit}&skip=${skip}`)
        if (res.ok) {
            const data = await res.json();
            // //  console.log(data, "response...>>>>>>>>>>>>>...")
            return data
        }
    } catch (err) {

        //  console.log("error in getting data", err)
        return err
    }
}