"use client";
import Image from "next/image";

interface DonateCardProps {
    title: string;
    subtitle: string;
    image: any;
}

const DonateCard = ({ title, subtitle, image }: DonateCardProps) => {
    return (
        <div className="w-full min-h-[200px] sm:min-h-[220px] lg:min-h-[265px] relative rounded-2xl overflow-hidden shadow-sm">
            <div className="relative w-full h-full min-h-[inherit] aspect-[4/3] sm:aspect-auto">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
                    aria-hidden
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex flex-col gap-2 z-10">
                <h2 className="text-white text-[14px] md:text-xl font-medium leading-snug">{title}</h2>
                <p className="text-white text-[12px] md:text-[16px] italic leading-relaxed">{subtitle}</p>
            </div>
        </div>
    );
};

export default DonateCard;
