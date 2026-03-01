import React, { useState } from "react";

const Carousel = () => {
  const [index, setIndex] = useState<number>(0);
  const images = [
    "https://picsum.photos/id/1018/600/300",
    "https://picsum.photos/id/1015/600/300",
    "https://picsum.photos/id/1019/600/300",
  ];

  const handelNext = () => {
    setIndex((p) => (index === images?.length - 1 ? 0 : p + 1));
  };

  const handelprev = () => {
    setIndex((prev) => (index === 0 ? images?.length - 1 : prev - 1));
  };
  return (
    <div>
      <div className="overflow-hidden w-full">
        <div
          className={`flex transition-all ease-in-out duration-400  `}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((i, idx) => {
            return <img src={i} key={idx} className="w-full " alt="" />;
          })}
        </div>
      </div>
      <div className=" w-full flex justify-center gap-5 mt-5 text-white">
        <button
          className=" bg-blue-500 px-4 py-2 text-white"
          onClick={handelNext}
        >
          Prev
        </button>
        <button
          className=" bg-blue-500 px-4 py-2 text-white"
          onClick={handelprev}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
