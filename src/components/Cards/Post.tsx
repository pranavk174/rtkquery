import { useToast } from '@/ContextApi/ToastWrapper';
import { useEditPostMutation, useLazyGetPostQuery } from '@/redux/services/apiServices';
import React, { useState } from 'react'

const Post = ({ post }) => {
    const [editPost] = useEditPostMutation();
    const { showToast } = useToast()
    const [editingPost, setEditingPost] = useState({

    })
    const [getPost] = useLazyGetPostQuery();
    const handleUpdatePost = (id: string) => {
        if (editingPost !== null) editPost({ id, payload: editingPost, method: 'PUT' });
        showToast("Update completed", 'success', 5000)
        setEditingPost(null);
    };

    const handleDeletePost = (id: string) => {
        editPost({ id, method: 'DELETE' })
        showToast("Deleted completed", 'success', 5000)
    }


    const handleClick = (id: string) => {
        console.log(id, "id........");
        getPost(id);
    };


    return (
        <div
            key={post._id}
            className="dark:bg-white bg-black text-white dark:text-black mb-4  border rounded-lg p-4 shadow-sm"
        >
            {editingPost?.id === post._id ? (
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
                    <div className="flex justify-between items-start  mb-2">
                        <h3 className="text-lg font-semibold dark:text-gray-800">
                            {post.id}. {post.title} fghgfhghg
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
    )
}

export default Post