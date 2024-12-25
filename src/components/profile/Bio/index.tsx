"use client";
import DetailCard from "./DetailCard";
import TagComponent from "@/components/common/Tag";
import BioHeader from "@/components/profile/Bio/BioHeader";
import Divider from "@/components/common/Divider";
import DetailChipCard from "@/components/profile/Bio/DetailChipCard";

const index = ({ data }: any) => {

    const details = [
        { title: "Subjects I Teach", tags: data?.subjects },
        { title: "Languages I Speak", tags: data?.languages },
        { title: "Skills", tags: data?.skills },
    ];

    const bio = [
        {
            title: "Experience",
            description: data?.experience,
        },
        {
            title: "Education",
            description: data?.education,
        },
    ];

    return (
        <div className="bg-white rounded-3xl w-full flex flex-col gap-6 py-5 h-[83vh]">
            <BioHeader data={data} />
            <Divider />
            <div className="h-[65vh] overflow-y-auto flex flex-col gap-3">
                <div className="px-5 flex flex-col gap-3">
                    <p className="font-medium text-xl">Bio</p>
                    <p className="text-sm text-gray-light font-normal">
                        {data?.bio_description}
                    </p>
                </div>
                {/* <div className="px-5 flex items-center justify-between gap-3">
                    <p className="font-medium ">Location</p>
                    <TagComponent text="New York, NY" className="text-xs py-1 font-medium px-2" />
                </div> */}
                {details.map((detail) => (
                    <DetailChipCard key={detail.title} tags={detail.tags} title={detail.title} />
                ))}
                {bio.map((item) => (
                    <DetailCard key={item.title} title={item.title} description={item.description} />
                ))}
            </div>
        </div>
    );
};

export default index;
