import React from "react";
import ContainerWrapper from "../components/ContainerWrapper";
import ContainerHeader from "../components/ContainerHeader";
import Testimonial from "../components/Testimonial";
import TestimonialDummyImg from "@/assets/images/TestimonialDummyImg.png";

export interface TestimonialData {
    category: string;
    quote: string;
    author: string;
    role: string;
    image: any;
}

const Testimonials = () => {
    const testimonialsLearners: TestimonialData[] = [
        {
            category: "Learners",
            quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",
            author: "John Doe",
            role: "Volunteer Teacher",
            image: TestimonialDummyImg,
        },
        {
            category: "Learners",
            quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",

            author: "Jane Smith",
            role: "Math Teacher",
            image: TestimonialDummyImg,
        },
        // Add more testimonials as needed
    ];

    const testimonialsVolunteers: TestimonialData[] = [
        {
            category: "Volunteers",
            quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",
            author: "John Doe",
            role: "Volunteer Teacher",
            image: TestimonialDummyImg,
        },
        {
            category: "Volunteers",
            quote: "Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it. Teaching here has been life-changing. Seeing my learner’s progress and confidence grow makes every moment worth it.",
            author: "John Doe",
            role: "Volunteer Teacher",
            image: TestimonialDummyImg,
        },
    ];

    return (
        <ContainerWrapper>
            <ContainerHeader
                title="Testimonials"
                subTitle="What our community says"
                description="Heartwarming stories from volunteers and families who've experienced the joy of learning together."
            />
            <div className="bg-[#f4f7fb] shadow-inner rounded-3xl md:p-6 md:py-20 grid lg:grid-cols-2 grid-cols-1 gap-4 place-items-center w-full">
                <div className="w-[80%]">
                    <Testimonial testimonials={testimonialsLearners} />
                </div>
                <div className="w-[80%]">
                    <Testimonial testimonials={testimonialsVolunteers} />
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default Testimonials;
