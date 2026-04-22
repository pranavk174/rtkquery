"use client";
import { useCallback, useState } from "react";
import RenderFiles from "./Folder";
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
  const [file, setFile] = useState<folder[]>([
    {
      name: "src",
      type: "folder",
      source: "root",
      items: [],
      id: crypto.randomUUID(),
    },
  ]);
  const [showInput, setShowInput] = useState<inputProps | null>(null);
  const [name, setName] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  //   const [state, dispatch] = useReducer(reducer, initialState);

  const findSource = (source: string, folder: folder[], payload: folder) => {
    debugger;
    if (!source) {
      return folder;
    }

    console.log("yes her pk..", folder, source);

    if (source === "root") {
      //   folder.push(payload);
      //   setFile(folder);

      return [...folder, payload];
    }
    const updated: folder[] = folder.map((d) => {
      console.log(d, "ddtaaaaa");
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

  // console.log(file, "fileeeeeee", payload);

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Folders</h2>

        <li
          // onClick={(e) => {
          //   e.preventDefault();
          //   addFiles(source, payload);
          // }}
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
        <RenderFiles
          file={file}
          rootFiles={file}
          setName={setName}
          name={name}
          setShowInput={setShowInput}
          showInput={showInput}
          addFiles={addFiles}
        />
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
