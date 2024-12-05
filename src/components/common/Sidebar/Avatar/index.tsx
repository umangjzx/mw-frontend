"use client";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import TagComponent from "@/components/common/Tag";
import { getLocalStorage } from "@/utils/localStorage";
import Image from "next/image";

const Avatar = () => {
    const text = getLocalStorage("role");

    return (
        <div className="flex flex-col items-center gap-2 p-2">
            <Image src={DummyProfileImg} alt="avatar" width={80} height={80} />
            <p className="font-medium">Alexander Harris</p>
            <TagComponent text={text} />
        </div>
    );
};

export default Avatar;
