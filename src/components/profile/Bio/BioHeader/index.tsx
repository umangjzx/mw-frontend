"use client";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import TagComponent from "@/components/common/Tag";
import Image from "next/image";
import EditProfileIcon from "@/assets/icons/EditProfileIcon";
import Cookies from "js-cookie"
import Link from "next/link";

const BioHeader = ({ data }: any) => {
    const role = Cookies.get("role") || "";

    return (
        <div className="flex flex-col gap-4 w-full px-5">
            <div className="flex justify-between items-center gap-2 ">
                <div className="flex items-center gap-2">
                    <Image src={data?.profile_picture || DummyProfileImg} alt="avatar" width={100} height={100} className="!rounded-full !object-cover !w-[80px] !h-[80px]" />
                    <div className="flex flex-col gap-2">
                        <p className="font-medium text-xl">{data?.full_name}</p>
                        <TagComponent text={role} className="text-xs py-1 px-2" />
                        <p className="text-xs font-medium text-gray-light">{data?.timezone}</p>
                    </div>
                </div>
                <Link href={`/${role}/profile?mode=edit`}>
                    <EditProfileIcon />
                </Link>
            </div>
            {/* <div className="w-full flex justify-center my-6">
            <video
        src= "https://pub-44684860ea0e49a08e2dd7abd6c0708b.r2.dev/melody-wings/videos/f3d01c51-612c-4777-81d5-4bce130f5b73/d99891d2-240f-4738-9e3c-6d4a81da0cbd"
        controls
        preload="metadata"
        className="w-full max-w-2xl rounded-xl shadow-lg"
      >
        Your browser does not support the video tag.
      </video>
    </div> */}
        </div>
    );
};

export default BioHeader;
