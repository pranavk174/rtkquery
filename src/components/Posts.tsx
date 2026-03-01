"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useUploadPostsMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useLazyGetPostQuery,
  useEditPostMutation,
} from "@/redux/services/apiServices";
import { Post, PostsProps } from "@/redux/types";
import jsondata from "../data.json";
import { useToast } from "@/ContextApi/ToastWrapper";

export default function Posts() {
  const [uploadPosts, { }] = useUploadPostsMutation();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  const [type, setType] = useState<string>("All");

  const { showToast } = useToast()
  // RTK Query hooks
  const { data } = useGetPostsQuery({ limit, skip, type });

  // const { data: post } = useGetPostQuery();
  const [getPost, { data: post, isLoading, error }] = useLazyGetPostQuery();

  // const [createPost] = useCreatePostMutation();
  const [editPost] = useEditPostMutation();
  // const [deletePost] = useDeletePostMutation();

  console.log(data, "data==========??????????????==============")
  const posts: Post[] = data?.posts ?? [];
  const totals: number = data?.total ?? 0;

  console.log(posts, "posts.....");

  const handleUpload = async () => {
    console.log(jsondata.posts, "data.....");

    const done = await uploadPosts(jsondata.posts);
    console.log(done, "done.....");
    showToast("Upload completed", 'success', 5000)
  };

  const handleClick = (id: string) => {
    console.log(id, "id........");
    getPost(id);
  };

  const handleUpdatePost = (id: string) => {
    if (editingPost !== null) editPost({ id, payload: editingPost, method: 'PUT' });
    showToast("Update completed", 'success', 5000)
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    editPost({ id, method: 'DELETE' })
    showToast("Deleted completed", 'success', 5000)
  }



  useEffect(() => {
    // getData();
  }, []);

  let pages: number[] = [];
  const totalPages = Math.floor(totals / limit);

  for (let i = limit; i <= totals; i += limit) {
    typeof i === "number" ? pages.push(i) : "";
  }

  console.log(pages, "pAGES..", totalPages);
  interface Props {
    id: number;
    value: string;
  }
  const options: Props[] = [
    {
      id: 1,
      value: "All",
    },
    {
      id: 2,
      value: "userId",
    },
    {
      id: 3,
      value: "id",
    },
  ];
  return (
    <div className="container max-w-[1400px] px-2 mx-auto  w-full">
      <div className="flex justify-between">
        <button className=" w-full bg-black dark:bg-[#f5f2f2] max-w-[200px] dark:text-black font-bold text-white" onClick={handleUpload}>
          Upload
        </button>
        <select
          onChange={(e) => setType(e.target.value)}
          className="  bg-black dark:bg-[#f5f2f2] dark:text-black text-white border p-2 rounded"
        >
          {options.map((o) => (
            <option key={o.id}>{o.value}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4  mt-2  max-h-[750px] h-full overflow-y-auto">
        {posts?.length > 0 &&
          posts?.map((post) => (
            <div
              key={post._id}
              className="dark:bg-white bg-black text-white dark:text-black  border rounded-lg p-4 shadow-sm"
            >
              {editingPost?.id === post.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    className="w-full p-2 border rounded font-semibold"
                  />
                  <textarea
                    value={editingPost.body}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, body: e.target.value })
                    }
                    className="w-full p-2 border rounded h-24"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        typeof post._id === "string"
                          ? handleUpdatePost(post?._id)
                          : ""
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPost(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="dark:bg-white bg-black text-white dark:text-black"
                  onClick={(e) => {
                    typeof post._id === "string" ? handleClick(post?._id) : "";
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold dark:text-gray-800">
                      {post.id}. {post.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClickCapture={(e) => {
                          e.stopPropagation(), setEditingPost(post);
                        }}
                        className="bg-yellow-500 text-white dark:text-gray-800 px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClickCapture={(e) => {
                          console.log("hello world", post.id)
                          e.stopPropagation(), post._id !== undefined ? handleDeletePost(String(post._id)) : '';
                        }}

                        className="bg-red-500 text-white px-3 dark:text-gray-800 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="dark:text-gray-600">{post.body}</p>
                  <p className="text-sm dark:text-gray-800 mt-2">
                    User ID: {post.userId}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className=" w-full flex justify-center dark:text-gray-800 gap-5 mt-5 text-white">
        <button
          className=" bg-blue-500 dark:bg-white dark:text-gray-800 px-4 py-2 text-white"
          onClick={() => setSkip((p) => (p <= 0 ? p : p - Number(limit)))}
        >
          Prev
        </button>
        <button
          className=" bg-blue-500 dark:bg-white px-4 py-2 dark:text-gray-800 text-white"
          onClick={() => setSkip((p) => (p >= 250 ? p : p + Number(limit)))}
        >
          Next
        </button>

        <button
          className=" bg-blue-500 dark:bg-white px-4 py-2 dark:text-gray-800 text-white"
          onClick={() => showToast('hello world ', 'success', 3000)}
        >
          Open Modal
        </button>
      </div>
    </div>
  );
}
