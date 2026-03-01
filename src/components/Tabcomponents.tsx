"use client";
import Link from "next/link";
import Posts from "./Posts";
import Products from "./Products";
import { useState } from "react";
import CursorPosts from "./Postscursor";
import VirtualizedPosts from "./VirtualizedPosts";
import VirtualizedVariablePosts from "./virtualiazedVariablePosts";
export default function TabsClient() {

    const [tab, setTab] = useState('post')


    return (
        <>


            {tab === "post" && < VirtualizedPosts />}
            {tab === "products" && <Products />}
        </>
    );
}
