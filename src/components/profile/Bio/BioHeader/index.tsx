"use client";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import TagComponent from "@/components/common/Tag";
import { getLocalStorage } from "@/utils/localStorage";
import Image from "next/image";
import EditProfileIcon from "@/assets/icons/EditProfileIcon";

const Bio = () => {
    const text = getLocalStorage("role");

    return (
        <div className="flex flex-col gap-4 w-full px-5">
            <div className="flex justify-between items-center gap-2 ">
                <div className="flex items-center gap-2">
                    <Image src={DummyProfileImg} alt="avatar" width={80} height={80} />
                    <div className="flex flex-col gap-2">
                        <p className="font-medium text-xl">Alexander Harris</p>
                        <TagComponent text={text} className="text-xs py-1 px-2" />
                    </div>
                </div>
                <EditProfileIcon />
            </div>
        </div>
    );
};

export default Bio;
