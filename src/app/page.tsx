"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/localStorage";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        setLocalStorage("role", "volunteer");
        router.push("/login");
    }, []);
    return <div></div>;
}
