"use client";
import Image from "next/image";
import ContainerHeader from "../components/ContainerHeader";
import ContainerWrapper from "../components/ContainerWrapper";

// Import all frames at once using an object
const frames = {
    FrameOne: require("@/assets/images/landingpage/moments/frame1.png"),
    FrameTwo: require("@/assets/images/landingpage/moments/frame2.png"),
    FrameThree: require("@/assets/images/landingpage/moments/frame3.png"),
    FrameFour: require("@/assets/images/landingpage/moments/frame4.png"),
    FrameFive: require("@/assets/images/landingpage/moments/frame5.png"),
    FrameSix: require("@/assets/images/landingpage/moments/frame6.png"),
    FrameSeven: require("@/assets/images/landingpage/moments/frame7.png"),
    FrameEight: require("@/assets/images/landingpage/moments/frame8.png"),
    FrameNine: require("@/assets/images/landingpage/moments/frame9.png"),
};

// Grid layout configurations
const gridLayouts = [
    {
        className: "grid-cols-[1.2fr,1.5fr,0.9fr] h-[70px] md:h-[156px]",
        images: ["FrameOne", "FrameTwo", "FrameThree"],
    },
    {
        className: "grid-cols-[2fr,5fr,1.5fr] h-[110px] md:h-[360px]",
        images: ["FrameFour", "FrameFive", "FrameSix"],
    },
    {
        className: "grid-cols-[1fr,1fr,1.3fr] h-[70px] md:h-[156px]",
        images: ["FrameSeven", "FrameEight", "FrameNine"],
    },
];

// Reusable Image component
const ImageFrame = ({ src, alt = "Celebrate" }: { src: string; alt: string }) => (
    <div className="h-full w-full relative overflow-hidden md:rounded-xl rounded-md">
        <Image
            src={src}
            alt={alt}
            className="h-full w-full object-cover md:rounded-xl rounded-md hover:scale-[1.03]  transition-all duration-300"
            fill
        />
    </div>
);

const Celebrate = () => {
    return (
        <ContainerWrapper>
            <ContainerHeader
                title="Heart in Action"
                subTitle="Celebrating Moments That Matter"
                description="A glimpse into the smiles, connections, and learning journeys created by our community."
            />
            <div className="mt-10 lg:mt-0 grid w-full gap-1 lg:gap-2 max-w-[1200px] mx-auto">
                {gridLayouts.map((layout, index) => (
                    <div key={index} className={`grid w-full gap-1 lg:gap-2 ${layout.className}`}>
                        {layout.images.map((frameName) => (
                            <ImageFrame
                                key={frameName}
                                src={frames[frameName as keyof typeof frames]}
                                alt={frameName}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </ContainerWrapper>
    );
};

export default Celebrate;
