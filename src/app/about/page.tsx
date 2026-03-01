"use client";
import Breadcrump from "@/components/Breadcrump";
import React from "react";
import { usePathname } from "next/navigation";

const page = () => {
  const pathName = usePathname();
  return (
    <div>
      {" "}
      <Breadcrump paths={pathName} />{" "}
    </div>
  );
};

export default page;
