import React, { useState } from "react";

const Breadcrump = ({ paths }: string) => {
  const breadcrumbData = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Mobile Phones", href: "/products/electronics/mobiles" },
  ];

  const splittedPath = (pathName: string) => {
    console.log(pathName, "payhname");
    const result =
      pathName !== "/" ? pathName.split("/").filter(Boolean) : pathName;
    console.log(result, "result....");

    return result;
  };

  const data = splittedPath(paths);

  console.log(typeof data, "data....");

  const [items, setItems] = useState<string[]>([]);

  return (
    <div className="flex text-white">
      {Array.isArray(data) &&
        data?.map((item: string, id: number) => {
          return (
            <div key={id} className="">
              {item} {data.length - 1 !== id ? "-->" : ""}
            </div>
          );
        })}

      <div className="flex gap-2">
        {/* {data?.map((item: string, idx: number) => {
          return (
            <button
              key={idx}
              //   onClick={() => setItems((prev) => [...prev, item.label])}
            >
              {item}
            </button>
          );
        })} */}

        {/* <div>{splittedPath(paths)}</div> */}
      </div>
    </div>
  );
};

export default Breadcrump;
