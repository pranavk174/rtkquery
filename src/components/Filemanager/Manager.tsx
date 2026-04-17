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

const Manager = () => {
  const [file, setFile] = useState<folder[]>([]);
  const [showInput, setShowInput] = useState<inputProps | null>(null);
  const [name, setName] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  //   const [state, dispatch] = useReducer(reducer, initialState);

  const findSource = (source: string, folder: folder[], payload: folder) => {
    if (!source) {
      return folder;
    }
    debugger;
    if (source === "root") {
      //   folder.push(payload);
      //   setFile(folder);
      return [...folder, payload];
    }
    const updated: folder[] = folder.map((d) => {
      if (typeof d === "object") {
        if (d.id === source) {
          console.log(d.items, "dataaaa d", source);
          return {
            ...d,
            items: d.items === null ? [payload] : [...d.items, payload],
          };
        } else {
          if (d.items !== null) {
            return {
              ...d,
              items: findSource(source, d.items, payload),
            };
          }
        }
      }
      return d;
    });

    console.log(updated, "folder i method");

    return updated;
  };

  const addFiles = (source: string, payload: folder) => {
    if (source === "") {
      return;
    }

    console.log("cleareddd.");
    // const payload = {
    //   name,
    //   id: crypto.randomUUID(),
    //   type,
    //   source,
    // };

    const folder = findSource(source, file, payload);

    setFile(folder);
    console.log("triggered...", folder);
  };

  //   const newFile = ({ id, type }: inputProps) => {
  //     setShowInput({
  //       type: type,
  //       id,
  //     });
  //   };

  const source = "root";

  const payload = {
    name: "src",
    type: "folder",
    source: showInput?.id ?? "root",
    items: showInput?.type === "folder" ? [] : null,
    id: crypto.randomUUID(),
  };

  console.log(file, "fileeeeeee", payload);

  const renderFiles = (file: folder[]) => {
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
                  {f?.items && f.items.length > 0 && renderFiles(f.items)}
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

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Folders</h2>

        <li
          onClick={(e) => {
            e.preventDefault();
            addFiles(source, payload);
          }}
          className="cursor-pointer hover:bg-gray-200 p-2 rounded"
        >
          <div className="flex justify-between">
            <button className="cursor-pointer hover:bg-blue-400">
              <span>📁 Root</span>
            </button>
            <div className="max-w-[60px] w-full flex justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="cursor-pointer hover:bg-green-400"
              >
                <span>+📄</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="cursor-pointer hover:bg-red-400"
              >
                <span>+📁</span>
              </button>
            </div>
          </div>
        </li>
        {renderFiles(file)}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Files</h1>

        <div className="grid grid-cols-4 gap-4">
          {/* File Card */}
          <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer">
            📄 index.js
          </div>

          <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer">
            📄 App.js
          </div>

          <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer">
            📄 styles.css
          </div>

          <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer">
            📄 utils.js
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
