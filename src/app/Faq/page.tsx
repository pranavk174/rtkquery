"use client";
import Breadcrump from "@/components/Breadcrump";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const page = () => {
  const pathName = usePathname();

  //  console.log(pathName, "path name");
  return (
    <div className="text-white">
      page
      <Breadcrump paths={pathName} />
      <Link href="/Faq/single">SIngle</Link>
    </div>
  );
};

export default page;
