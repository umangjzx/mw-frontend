"use client";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import TagComponent from "@/components/common/Tag";
import Image from "next/image";
import EditProfileIcon from "@/assets/icons/EditProfileIcon";
import Cookies from "js-cookie"
import Link from "next/link";

const Bio = ({ data }: any) => {
    const text = Cookies.get("role") || "";

    return (
        <div className="flex flex-col gap-4 w-full px-5">
            <div className="flex justify-between items-center gap-2 ">
                <div className="flex items-center gap-2">
                    <Image src={data?.profile_picture || DummyProfileImg} alt="avatar" width={100} height={100} className="!rounded-full !object-cover !w-[80px] !h-[80px]" />
                    <div className="flex flex-col gap-2">
                        <p className="font-medium text-xl">{data?.full_name}</p>
                        <TagComponent text={text} className="text-xs py-1 px-2" />
                    </div>
                </div>
                <Link href={`/${text}/profile?mode=edit`}>
                    <EditProfileIcon />
                </Link>
            </div>
        </div>
    );
};

export default Bio;
