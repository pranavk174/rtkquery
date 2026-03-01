"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { VariableSizeList } from "react-window";
import {
    useUploadPostsMutation,
    useGetCursorPostsQuery,
} from "@/redux/services/apiServices";
import { Post } from "@/redux/types";
import PostCard from "./Cards/Post";
import jsondata from "../data.json";
import { useToast } from "@/ContextApi/ToastWrapper";
import Loading from "./Loader";

export default function VirtualizedVariablePosts() {
    const [cursor, setCursor] = useState<string | null>(null);
    const [type, setType] = useState("All");

    const { showToast } = useToast();
    const [uploadPosts] = useUploadPostsMutation();

    const { data, isFetching, isLoading } =
        useGetCursorPostsQuery({ cursor, type });

    const posts: Post[] = data?.posts ?? [];

    const sizeMap = useRef<Record<number, number>>({});
    const listRef = useRef<VariableSizeList>(null);

    // Upload handler
    const handleUpload = async () => {
        await uploadPosts(jsondata.posts);
        showToast("Upload completed", "success", 3000);
    };

    // Clear height cache when filter changes
    // useEffect(() => {
    //     sizeMap.current = {};
    //     listRef.current?.resetAfterIndex(0);
    //     setCursor(null);
    // }, [type]);

    // Get row size
    // const getSize = useCallback(
    //     (index: number) => sizeMap.current[index] || 280, // realistic default
    //     []
    // );

    const getSize = (index: number) => sizeMap.current[index] || 280;

    // Row Component
    const Row = ({ index, style, data }: any) => {
        const sizeRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            if (!sizeRef.current) return;

            const ro = new ResizeObserver(entries => {
                const height = entries[0].contentRect.height;

                const prev = sizeMap.current[index];
                console.log(height, "entriuesssssss", prev, sizeMap)
                if (prev !== height) {
                    sizeMap.current[index] = height;
                    listRef.current?.resetAfterIndex(index);
                }
            });

            ro.observe(sizeRef.current);
            return () => ro.disconnect();
        }, [index]);

        return (
            <div style={style}>
                <div ref={sizeRef} style={{ paddingBottom: 8 }}>
                    <PostCard post={data[index]} />
                </div>
            </div>
        );
    };

    // Infinite scroll trigger
    const handleItemsRendered = ({ visibleStopIndex }: any) => {
        if (
            visibleStopIndex >= posts.length - 3 &&
            data?.hasMore &&
            !isFetching
        ) {
            setCursor(data.nextCursor);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="container max-w-[1400px] mx-auto px-2">

            <div className="flex justify-between mb-3">
                <button
                    className="bg-black text-white px-4 py-2 rounded"
                    onClick={handleUpload}
                >
                    Upload
                </button>

                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="bg-black text-white p-2 rounded"
                >
                    <option value="All">All</option>
                    <option value="userId">userId</option>
                    <option value="id">id</option>
                </select>
            </div>

            <VariableSizeList
                ref={listRef}
                height={700}
                itemCount={posts.length}
                itemSize={getSize}
                width="100%"
                itemData={posts}
                onItemsRendered={handleItemsRendered}
            >
                {Row}
            </VariableSizeList>

            {/* {isFetching && <Loading />} */}
        </div>
    );
}
