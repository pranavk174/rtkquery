import React, { useState } from "react";

const Accordion = () => {
  const accordionData = [
    {
      id: 1,
      title: "What is React?",
      content:
        "React is a JavaScript library for building user interfaces, maintained by Facebook.",
    },
    {
      id: 2,
      title: "What is Tailwind CSS?",
      content:
        "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.",
    },
    {
      id: 3,
      title: "What is Redux Toolkit?",
      content:
        "Redux Toolkit is the official, recommended way to write Redux logic with less boilerplate.",
    },
    {
      id: 4,
      title: "What is Next.js?",
      content:
        "Next.js is a React framework that enables server-side rendering and static site generation.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-h-[300px] bg-red-600 h-[250px] overflow-y-auto">
      {accordionData.map((acc, idx) => {
        return (
          <div className=" mb-2  w-full  bg-red-200" key={acc.id}>
            <button
              type="button"
              className="w-full flex justify-between items-center px-4 py-3 text-left bg-green-500 text-white cursor-pointer hover:bg-green-600 relative z-10"
              onClick={() => setOpen(open === acc.id ? null : acc.id)}
            >
              <span className="relative z-20 pointer-events-none">
                {acc.title}
              </span>

              <span
                className={`relative z-20 pointer-events-none ${open === acc.id ? "-rotate-210" : "-rotate-210"} `}
              >
                <svg
                  className={`w-3 h-3 ${open === acc.id ? "-rotate-150" : "rotate-30"} transition-rotate duration-400 ease-in-out text-gray-800 dark:text-white`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 8"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                  />
                </svg>
              </span>
            </button>

            <div
              className={` text-white bg-red-500 transition-all duration-500 ease-in-out ${open === acc.id ? "max-h-[200px] " : "max-h-[0px] opacity-0"}  `}
            >
              {acc.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
