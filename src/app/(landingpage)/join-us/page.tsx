"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import image1 from "@/assets/images/image1.jpg";

const JoinUsPage = () => {
    return (
        <div className="w-full bg-background-input min-h-screen">
            <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
                {/* Main Heading */}
                <div className="bg-white rounded-[24px] py-10" style={{ borderRadius: '24px' }}>
                <div className="mb-8 px-10">
                    <h1 className="text-3xl md:text-4xl lg:text-[32px] font-semibold text-gray-900">
                        Join the MelodyWings Operations Team
                    </h1>
                </div>

                {/* Image Section */}
                <div className="w-full mb-8 md:mb-10 lg:mb-12 overflow-hidden px-10">
                    <div className="relative w-full aspect-[1200/400] bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                            src={image1}
                            alt="MelodyWings Operations Team working together"
                            fill
                            className="object-cover rounded-lg"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                        />
                    </div>
                </div>

                {/* Content Section with White Background */}
                <div className="w-full  rounded-lg px-7">
                    <div className="w-full max-w-none space-y-6 md:space-y-7 lg:space-y-8 italic">
                        {/* First Paragraph */}
                        <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-left">
                            At MelodyWings, we don't just run programs — we create spaces where every challenged child and learner is seen, heard, and valued.
                        </p>

                        {/* Second Paragraph */}
                        <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-left">
                            Behind every volunteer who shows up, every session that runs smoothly, and every small breakthrough moment is an Operations Team quietly making it all possible.
                        </p>

                        {/* Third Paragraph */}
                        <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-left">
                            When you join MelodyWings, you help build the bridge between volunteers and learners, creating a space where every learner is supported, empowered, and encouraged to grow. Whether you're interested in nonprofit leadership, education, technology, or social impact, MelodyWings offers hands-on experience in operations, teamwork, communication, and problem-solving—experience that goes far beyond a resume line.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-start mt-8">
                        <Button
                            title="Apply here to Get Involved"
                            btnVariant="secondary"
                            customClassName="!px-4 !py-[10px] !h-12 !text-[18px] !font-medium !rounded-[10px] !text-white !bg-black hover:!bg-black"
                            onClick={() => {
                                // Add your application link or modal handler here
                                window.open("mailto:support@melodywings.org?subject=Operations Team Application", "_blank");
                            }}
                        />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default JoinUsPage;
