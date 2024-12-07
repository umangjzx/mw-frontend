"use client";

import { MessageModal, TestmonialModal } from "@/components/learners/Modals";
import LearnersTable from "@/components/learners/Table";
import { useQueryState } from "nuqs";

export default function LearnersPage () {


    const [_, setLearnerId] = useQueryState("id", {
        shallow: true,
    });
    const [mode, setMode] = useQueryState("mode", {
        shallow: true,
    });

    const handleMessageLearner = (learnerId: string) => {
        console.log("Message learner:", learnerId);
        setLearnerId(learnerId);
        setMode("message");
    };

    const handleUploadTestimonial = (learnerId: string) => {
        console.log("Upload testimonial:", learnerId);
        setLearnerId(learnerId);
        setMode("testimonial");
    };

    const handleClose = () => {
        setLearnerId(null);
        setMode(null);
    };

    return (
        <div className='w-full h-full p-6'>
            <MessageModal isOpen={mode === "message"} onClose={handleClose} />
            <TestmonialModal isOpen={mode === "testimonial"} mode={"create"} onClose={handleClose} />
            <LearnersTable
                data={[
                    {
                        id: "1",
                        name: "John Doe",
                        classesTaken: 10,
                        subject: "Math",
                    },
                ]}
                handleMessageLearner={handleMessageLearner}
                handleUploadTestimonial={handleUploadTestimonial}
            />
        </div>
    );
}
