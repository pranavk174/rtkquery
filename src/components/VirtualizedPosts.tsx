"use client";
import { useEffect, useRef, useState } from "react";
import {
    useUploadPostsMutation,
    useLazyGetPostQuery,
    useEditPostMutation,
} from "@/redux/services/apiServices";
import { Post } from "@/redux/types";
import { useGetPostsQuery } from "@/redux/services/graphqlAPi";
import { FixedSizeList } from "react-window";
import PostCard from "./Cards/Post";
import jsondata from "../data.json";
import { useToast } from "@/ContextApi/ToastWrapper";
import Loading from "./Loader";
export default function VirtualizedPosts() {
    const [uploadPosts, { }] = useUploadPostsMutation();
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [type, setType] = useState<string>("All");

    const [cursor, setCursor] = useState<string | null>(null);

    const { showToast } = useToast()
    // RTK Query hooks
    const { data, isFetching, isLoading: loader } = useGetPostsQuery({ cursor, skip: 0, type });

    const [getPost] = useLazyGetPostQuery();

    const [editPost] = useEditPostMutation();

    //  console.log(data, "data==========??????????????==============")
    const posts: Post[] = data?.posts ?? [];
    const totals: number = data?.total ?? 0;

    //  console.log(posts, "posts.....");

    const handleUpload = async () => {
        //  console.log(jsondata.posts, "data.....");

        const done = await uploadPosts(jsondata.posts);
        //  console.log(done, "done.....");
        showToast("Upload completed", 'success', 5000)
    };

    // const handleScroll = () => {
    //   if (window.innerHeight + window.scrollY > document.body.offsetHeight - 200 && data?.hasMore && !isFetching) {
    //     setCursor(data?.nextCursor)
    //     //  console.log("triggered data...")
    //   }
    // }


    const bottomRef = useRef(null);


    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && data?.hasMore && !isFetching) {
                // //  console.log(entries, "entriesssssssss")
                setCursor(() => data.nextCursor)
            }
        }, {
            rootMargin: "200px"
        })


        if (bottomRef.current) observer.observe(bottomRef.current)

        //  console.log("= data =================")
        return () => observer.disconnect()
    }, [data, cursor]);


    //  console.log(cursor, "cursor       ==========")

    let pages: number[] = [];
    const totalPages = Math.floor(totals / 10);

    for (let i = 10; i <= totals; i += 10) {
        typeof i === "number" ? pages.push(i) : "";
    }

    //  console.log(pages, "pAGES..", totalPages);
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



    if (loader) {
        return <Loading />
    }

    interface RowProps {
        index: number;
        style: React.CSSProperties;
        data: Post[];
    }

    const Row = ({ index, style, data }: RowProps) => {
        const post = data[index];

        return (
            <div style={style}>
                <PostCard post={post} />
            </div>
        );
    };


    interface ItemsRenderedProps {
        visibleStopIndex: number;
    }

    const handleIndex = ({ visibleStopIndex }: ItemsRenderedProps) => {
        //  console.log("chhhhhhhhakfhkahfkahfkakfhafkj======")
        //  console.log(data?.nextCursor, "==========")
        if (visibleStopIndex > posts.length - 2 && data?.hasMore && !isFetching) {
            setCursor(() => data?.nextCursor)

        }
    }


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
                <div className="mt-2 max-h-[750px]">
                    < FixedSizeList
                        height={700}
                        itemCount={posts.length}
                        itemSize={200}
                        width="100%"
                        itemData={posts}
                        onItemsRendered={handleIndex}
                    >
                        {Row}
                    </ FixedSizeList >

                    {loader && <Loading />}
                </div>

                {/* <div ref={bottomRef} /> */}

            </div>

            <div className=" w-full flex justify-center dark:text-gray-800 gap-5 mt-5 text-white">
                {/* <button
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
        </button> */}


                <button className=" bg-blue-500 dark:bg-white px-4 py-2 dark:text-gray-800 text-white" onClick={() => setCursor(data?.nextCursor)}>
                    Load more
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
