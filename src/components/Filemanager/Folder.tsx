"use client";
import { useState } from "react";

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
const RenderFiles = ({ file }: any) => {
  const [name, setName] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [showInput, setShowInput] = useState<inputProps | null>(null);
  return (
    <ul className="space-y-2">
      {file.map((f) => {
        return (
          <ul
            key={f.id}
            onClick={(e) => {
              e.preventDefault();

              console.log("clickedddd.");
              // if (open === f.id) {
              //   setOpen(null);
              // } else {
              setOpen(f.id);

              // }
            }}
            className="space-y-2"
          >
            <li
              onDoubleClick={() => f.id && addFiles(f.id, payload)}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <div className="flex justify-between">
                <button className="cursor-pointer hover:bg-blue-400">
                  <span>📁 {f.name}</span>
                </button>
                <div className="max-w-[60px] w-full flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (f.id) {
                        setShowInput({ id: f.id, type: "file" });
                      }
                    }}
                    className="cursor-pointer hover:bg-green-400"
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
                    className="cursor-pointer hover:bg-red-400"
                  >
                    <span>+📁</span>
                  </button>
                </div>
              </div>
            </li>
            <div
              className={` overflow-hidden transition-all duration-500 ${open === f.id ? "h-full" : "h-0"}`}
            >
              <ul className="ml-4 space-y-1">
                {f?.items && f.items.length > 0 && (
                  <RenderFiles file={f.items} />
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
};

export default RenderFiles;
