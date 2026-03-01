import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="text-white">
      page
      <Link href="/Faq/single/double">Double</Link>
    </div>
  );
};

export default page;
