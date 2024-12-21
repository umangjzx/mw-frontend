"use client";
import Image from "next/image";

interface DonateCardProps {
    title: string;
    subtitle: string;
    image: any;
}

const DonateCard = ({ title, subtitle, image }: DonateCardProps) => {
    return (
        <div className="w-full 2xl:h-[30vh] h-[25vh] relative">
            <div className="relative w-full h-full rounded-xl z-10">
                <Image src={image} alt="Donate" fill className="object-cover h-full rounded-xl" />
            </div>
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-30 w-[90%]">
                <h2 className="text-white text-xl font-medium">{title}</h2>
                <p className="text-white text-sm">{subtitle}</p>
            </div>
        </div>
    );
};

export default DonateCard;
