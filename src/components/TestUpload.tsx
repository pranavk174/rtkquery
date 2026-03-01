"use client";
import React, { useRef, useState } from "react";
import {
  useStartUploadMutation,
  useFinishUploadMutation,
  useCancelUploadMutation,
} from "@/redux/services/graphqlAPi";
import { useUploadChunkMutation } from "@/redux/services/apiServices";

const TestUpload = () => {
  const CHUNK_SIZE = 1024 * 1024;
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeChunk, setActiveChunk] = useState(0);
  const [uploadId, setUploadId] = useState("");

  const [uploadChunk] = useUploadChunkMutation();
  const [finishUpload] = useFinishUploadMutation();
  const [startUpload] = useStartUploadMutation();
  const controllerRef = useRef<AbortController | null>(null);
  const pausedRef = useRef(false);
  const uploadData = async (id: string) => {
    if (!file) return;

    try {
      const totalChunk = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = activeChunk; i < totalChunk; i++) {
        if (pausedRef.current) {
          return;
        }
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const form = new FormData();
        form.append("uploadId", id);
        form.append("chunk", chunk);
        form.append("index", i.toString());

        const data = await uploadChunk({
          formdata: form,
          signal: controllerRef.current?.signal,
        }).unwrap();

        setActiveChunk(i + 1);
        setProgress(Math.round(((i + 1) / totalChunk) * 100));

        //   const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      }

      const extension = file.name.split(".").pop();
      const done = await finishUpload({ uploadId: id, extension });

      if (done) {
        console.log(done);
        alert("upload completed");
      } else {
        alert("error in uploading");
      }
    } catch (error) {
      alert("error in uploading");
    }
  };

  const handleUpload = async () => {
    const data = await startUpload(file?.name ?? "").unwrap();
    // const id = data.data.data.startUpload.uploadId;
    console.log("data.....", data);
    // if (id) {
    //   setUploadId(id);
    //   uploadData(id);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">File Upload</h2>

        {/* File Input */}
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-2">
            Select File
          </span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
          />
        </label>

        {/* Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleUpload}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Start
          </button>

          <button
            onClick={() => (pausedRef.current = true)}
            className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Pause
          </button>

          <button
            onClick={() => {
              pausedRef.current = false;
              uploadData(uploadId);
            }}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Resume
          </button>

          {progress > 0 && progress < 100 && (
            <button
              //   onClick={cancelUpload}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
            <span>Upload Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUpload;
