import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { TestimonialData } from "@/components/landingpage/testimonials";
import TagComponent from "@/components/common/Tag";

interface TestimonialProps {
    testimonials: TestimonialData[];
}

export default function Testimonial({ testimonials }: TestimonialProps) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 5000,
    };

    return (
        <div className="w-full max-w-6xl mx-auto ">
            <Slider {...settings} className="testimonial-slider">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="">
                        <div className="bg-white rounded-3xl p-6 pb-14">
                            <div className="flex flex-col gap-8">
                                <div className="flex justify-center">
                                    <TagComponent
                                        className={`${
                                            testimonial.category === "Learners"
                                                ? "!bg-[#F0FAFF] !text-[#009BCC]"
                                                : "!text-[#FF9053] !bg-[#FFF5ED]"
                                        } py-1 !text-sm px-4 border-none`}
                                        text={testimonial.category}
                                    />
                                </div>
                                <p className="xl:text-xl text-lg font-normal">
                                    {testimonial.quote}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 relative rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.author}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium xl:text-xl text-lg mb-1">
                                            {testimonial.author}
                                        </p>
                                        <p className="font-medium xl:text-xl text-lg">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            <style jsx global>{`
                .testimonial-slider .slick-track {
                    display: flex !important;
                    gap: 0.1rem;
                }
                .testimonial-slider .slick-slide {
                    height: inherit !important;
                    margin: 0 0.1rem;
                }
                .testimonial-slider .slick-slide > div {
                    height: 100%;
                }
                .testimonial-slider .slick-dots {
                    bottom: 15px !important;
                }
            `}</style>
        </div>
    );
}
