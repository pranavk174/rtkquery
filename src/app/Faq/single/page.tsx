import React from "react";
import Link from "next/link";
import Uploader from "@/components/Uploader";

const page = () => {
  return (
    <div className="text-white">
      page
      {/* <Link href="/Faq/single/double">Double</Link> */}
      <Uploader />
    </div>
  );
};

export default page;
