"use client";
import Image from "next/image";
import ContainerHeader from "../components/ContainerHeader";
import ContainerWrapper from "../components/ContainerWrapper";

// Import all frames at once using an object
const frames = {
    FrameOne: require("@/assets/images/gridlayoutimages/Frame1.png"),
    FrameTwo: require("@/assets/images/gridlayoutimages/Frame2.png"),
    FrameThree: require("@/assets/images/gridlayoutimages/Frame3.png"),
    FrameFour: require("@/assets/images/gridlayoutimages/Frame4.png"),
    FrameFive: require("@/assets/images/gridlayoutimages/Frame5.png"),
    FrameSix: require("@/assets/images/gridlayoutimages/Frame6.png"),
    FrameSeven: require("@/assets/images/gridlayoutimages/Frame7.png"),
    FrameEight: require("@/assets/images/gridlayoutimages/Frame8.png"),
    FrameNine: require("@/assets/images/gridlayoutimages/Frame9.png"),
};

// Grid layout configurations
const gridLayouts = [
    {
        className: "grid-cols-[1.2fr,1.5fr,0.9fr] h-[156px]",
        images: ["FrameOne", "FrameTwo", "FrameThree"],
    },
    {
        className: "grid-cols-[1fr,4fr,1fr] h-[360px]",
        images: ["FrameFour", "FrameFive", "FrameSix"],
    },
    {
        className: "grid-cols-[1fr,1fr,1.3fr] h-[156px]",
        images: ["FrameSeven", "FrameEight", "FrameNine"],
    },
];

// Reusable Image component
const ImageFrame = ({ src, alt = "Celebrate" }: { src: string; alt: string }) => (
    <div className="h-full w-full relative rounded-xl overflow-hidden ">
        <Image
            src={src}
            alt={alt}
            className="h-full w-full object-cover rounded-xl hover:scale-[1.03]  transition-all duration-300"
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
            <div className="grid w-full gap-2 max-w-[1200px] mx-auto">
                {gridLayouts.map((layout, index) => (
                    <div key={index} className={`grid w-full gap-2 ${layout.className}`}>
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
