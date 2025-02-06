"use client";
import { endpoints } from "@/api/constants";
import { POST_API } from "@/api/request";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { LearnerCommunityFormConstants } from "@/constants/community";
import { useSendData } from "@/hooks/useReactQuery";
import { cn } from "@/utils/merge-class";
import { useState } from "react";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useWindowSize } from "@/hooks/useWindowSize";
import FeedHeader from "../FeedHeader";
type PostModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const PostModal = ({ isOpen, onClose }: PostModalProps) => {
    const [notes, setNotes] = useState("");
    const [uploadPictures, setUploadPictures] = useState<any[]>([]);
    const role = Cookies.get("role");
    const queryClient = useQueryClient();

    const handleChange = (key: string, value: any) => {
        if (key === "uploadPictures") {
            setUploadPictures(Array.isArray(value) ? value : [value].filter(Boolean));
        } else if (key === "notes") {
            setNotes(value);
        }
    };

    const handleSubmit = async () => {
        console.log("Form Data to submit:", { notes, uploadPictures });
        const payload = {
            description: notes,
            images: uploadPictures.map((image) => ({
                image_url: image.url,
                image_id: image.image_id,
            })),
            created_by: role,
        };
        return await POST_API(endpoints.post.createPost, payload);
    };

    const { mutate: onSave, isPending } = useSendData({
        fn: () => handleSubmit(),
        invalidateKey: ["learner-events"],
        success: () => {
            setNotes("");
            setUploadPictures([]);
            onClose();
            queryClient.invalidateQueries({ queryKey: ["get-posts"] });
        },
        error: (err) => {
            console.log("Error: ", err);
        },
    });
    const { width } = useWindowSize();
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    return (
        <CenterModal
            isOpen={isOpen}
            onClose={onClose}
            loading={isPending}
            width={isMobile ? "100vw" : isTablet ? "60%" : "40%"}
            height={isMobile ? "100vh" : "auto"}
            customClassName={cn(
                "max-h-[80vh] !rounded-2xl overflow-hidden",
                isMobile && "!h-screen !max-h-[100dvh] !rounded-none  [&_.ant-modal-content]:!px-4"
            )}
            hideFooter={isMobile}
            secondaryActionProps={
                !isMobile
                    ? {
                          onClick: onSave,
                          title: "Share now",
                          customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
                      }
                    : undefined
            }
            primaryActionProps={
                !isMobile
                    ? {
                          onClick: onClose,
                          title: "Cancel",
                          btnVariant: "secondary",
                          customClassName: cn("bg-transparent !text-black", "!rounded-xl"),
                      }
                    : undefined
            }
        >
            <div className="pb-2 hidden md:block">
                <h2>Add New Post</h2>
            </div>
            <div className=" md:hidden">
                <FeedHeader
                    title="Add new post"
                    onClose={onClose}
                    onSave={() => onSave(undefined)}
                />
            </div>
            {LearnerCommunityFormConstants.map((field: any) => (
                <Input
                    key={field.name}
                    {...field}
                    onChange={(value: any) => handleChange(field.name, value)}
                    value={field.name === "uploadPictures" ? uploadPictures : notes}
                />
            ))}
        </CenterModal>
    );
};

export default PostModal;
