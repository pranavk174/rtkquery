"use client";
import { memo, useState } from "react";

interface folder {
  name: string;
  type: string;
  items: folder[] | null;
  id: string;
  source: string | null;
}

interface inputProps {
  type: "folder" | "file";
  id: string;
}
const RenderFiles = memo(
  ({
    file,
    setName,
    name,
    setShowInput,
    showInput,
    addFiles,
    // rootFiles,
  }: any) => {
    // const [name, setName] = useState("");
    const [open, setOpen] = useState<string | null>(null);
    // const [showInput, setShowInput] = useState<inputProps | null>(null);

    return (
      <ul className=" ">
        {file.map((f) => {
          return (
            <ul
              key={f.id}
              onClick={(e) => {
                // e.preventDefault();
                e.stopPropagation();
                console.log("clickedddd.");
                if (open === f.id) {
                  setOpen(null);
                } else {
                  setOpen(f.id);
                }
              }}
              className=" dark:border-l-3  border-red-400"

            >
              <li
                // onDoubleClick={() => f.id && addFiles(f.id, payload)}
                className="cursor-pointer hover:bg-black mb-[1px] bg-gray-200 p-1 px-2 rounded"
              >
                <div className="flex  justify-between">
                  <button className="cursor-pointer flex gap-1 items-center ">
                    <span className={`mt-[5px] transition-transform text-red-400 duration-500 ${open === f.id ? 'rotate-90' : 'rotate-0'}`}><svg className="w-2 h-2 text-gray-300 hober:text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
                    </svg></span>  <span className="text-gray-400"> {f.name}</span>
                  </button>
                  <div className="max-w-[60px] w-full flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (f.id) {
                          setShowInput({ id: f.id, type: "file" });
                        }
                      }}
                      className="cursor-pointer text-[12px] text-black hover:bg-green-400"
                    >
                      <span>+📄</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (f.id) {
                          setShowInput({ id: f.id, type: "folder" });
                        }
                      }}
                      className="cursor-pointer text-[12px]  hover:bg-red-400"
                    >
                      <span className="text-gray-800 hover:text-white">+📁</span>
                    </button>
                  </div>
                </div>
              </li>
              <div
                className={` overflow-hidden transition-all duration-500 ${open === f.id ? "max-h-96" : "max-h-0"}`}
              >
                <ul className="ml-4 ">
                  {f?.items && f.items.length > 0 && (
                    <RenderFiles
                      file={f.items}
                      setName={setName}
                      name={name}
                      setShowInput={setShowInput}
                      showInput={showInput}
                      addFiles={addFiles}
                    />
                  )}
                </ul>
              </div>
              {showInput?.id === f.id && (
                <div className="flex flex-col gap-1 mt-2">
                  <label
                    htmlFor={`folder-name-${f.id}`}
                    className="text-sm font-medium text-gray-600"
                  >
                    {showInput.type.toUpperCase()} Name
                  </label>

                  <input
                    id={`folder-name-${f.id}`}
                    // onMouseLeave={() => setShowInput(null)}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                      // e.preventDefault()
                      if (e.key === "Enter") {
                        const payloads = {
                          name,
                          type: showInput?.type,
                          source: f.id,
                          items: showInput?.type === "folder" ? [] : null,
                          id: crypto.randomUUID(),
                        };

                        console.log(payloads, "payloads....");

                        addFiles(f.id, payloads);

                        setName("");
                        setShowInput(null); // 👈 enter press
                      }
                    }}
                    type="text"
                    value={name}
                    placeholder={`Enter ${showInput.type} name...`}
                    onChange={(e) => {
                      e.stopPropagation();
                      setName(e.target.value);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 text-sm"
                  />
                </div>
              )}
            </ul>
          );
        })}
      </ul>
    );
  },
);

RenderFiles.displayName = "Renderfiles";

export default RenderFiles;
