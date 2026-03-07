import Posts from "@/components/Posts";
import ProductsList from "@/components/ProductList";
import Products from "@/components/Products";
import TabsClient from "@/components/Tabcomponents";
import Uploader from "@/components/Uploader";
import TestUpload from "@/components/TestUpload";
import { fetchPosts, fetchProducts } from "@/utilities/apicalls";
export default async function Home({ searchParams }: { searchParams: any }) {
  const params = await searchParams; // 👈 unwrap

  // //  console.log(params, "searchparams....");

  // const tab = params.tab || "post";

  // let data = null;

  // if (tab === "post") {
  //   data = await fetchPosts(); // SSR call only here

  // }

  // if (tab === "products") {
  //   data = await fetchProducts(); // SSR call only here

  return (
    <div className="  ">
      {/* <Uploader />
       */}
      <ProductsList />
      {/* <TestUpload /> */}
    </div>
  );
}
