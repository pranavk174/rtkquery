"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Breadcrump from "@/components/Breadcrump";

const page = () => {
  const pathName = usePathname();
  console.log(usePathname(), "current path.....");

  const splittedPath = () => {
    const result = pathName.split("/").filter(Boolean);
    console.log(result, "result....");

    const final = result.join("-->");
    console.log(final, "final");
    return final;
  };

  splittedPath();
  return (
    <div className="tex-white">
      <Breadcrump paths={pathName} />
      page
    </div>
  );
};

export default page;
