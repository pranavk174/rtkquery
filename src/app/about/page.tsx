"use client";
import Breadcrump from "@/components/Breadcrump";
import React from "react";
import { usePathname } from "next/navigation";
import Manager from "@/components/Filemanager/Manager";

const page = () => {
  // const pathName = usePathname();
  return (
    <div className="h-[93.2vh]">
      {" "}
      {/* <Breadcrump paths={pathName} />{" "} */}
      <Manager />
    </div>
  );
};

export default page;
