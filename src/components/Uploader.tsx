"use client";
import React, { useRef, useState } from "react";

const Uploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadId, setUploadId] = useState<string>("");
  const [currentChunk, setCurrentChunk] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  const CHUNK_SIZE = 1024 * 1024;
  const pausedRef = useRef(false);
  const startUpload = async () => {
    if (!file || currentChunk > 0) return;

    controllerRef.current = new AbortController();
    const upload = await fetch(`api/graphql/product`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: `
mutation {
startUpload{
uploadId
chunkSize
      }}`,
      }),
    });

    const data = await upload.json();
    console.log(data, "data....");
    const id = data.data.startUpload.uploadId;
    setUploadId(id);

    uploadChunks(id);
  };

  const uploadChunks = async (id: string) => {
    try {
      if (!file) return;
      const totalChunk = Math.ceil(file.size / CHUNK_SIZE);
      console.log(
        "errrrrrrr ",
        // totalChunk,
        // CHUNK_SIZE,
        file,
        // currentChunk,
      );
      for (let i = currentChunk; i < totalChunk; i++) {
        if (pausedRef.current === true) {
          return;
        }

        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        console.log();
        const form = new FormData();
        form.append("uploadId", id);
        form.append("chunk", chunk);
        form.append("index", i.toString());

        await fetch("/api/products/upload", {
          method: "POST",
          body: form,
          signal: controllerRef.current?.signal,
        });

        setCurrentChunk(i + 1);
        setProgress(Math.round(((i + 1) / totalChunk) * 100));
      }

      const done = await fetch("/api/graphql/product", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          query: ` mutation finishUpload($uploadId: String!  , $extension:String!  ){
                      finishUpload(uploadId: $uploadId , extension: $extension ){
                      message
                      status}}`,
          variables: {
            uploadId: id,
            extension: file.name.split(".").pop(),
          },
        }),
      });

      if (done.ok) {
        console.log(done);
        alert("upload completed");
      } else {
        alert("error in uploading");
      }
    } catch (error) {
      alert("error in uploading");
    }
  };

  const cancelUpload = async () => {
    controllerRef.current?.abort();

    try {
      const res = await fetch(`/api/graphql/product`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation cancelUpload($uploadId:String!){
          cancelUpload(uploadId: $uploadId){
          message
          status}}`,
          variables: { uploadId: uploadId },
        }),
      });

      setProgress(0);
      setCurrentChunk(0);
      setUploadId("");
      if (res.ok) {
        return "success";
      }
    } catch (error) {
      console.log(error, "errorrrrr");
    }
  };

  //   console.log(paused, "paused...");

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
            onClick={startUpload}
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
              uploadChunks(uploadId);
            }}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Resume
          </button>

          {progress > 0 && progress < 100 && (
            <button
              onClick={cancelUpload}
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

export default Uploader;
