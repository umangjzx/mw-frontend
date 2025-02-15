"use client";
import { endpoints } from "@/api/constants";
import { POST_API, PUT_API } from "@/api/request";
import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { CommunityFormConstants } from "@/constants/community";
import { cn } from "@/utils/merge-class";
import { useState } from "react";
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWindowSize } from "@/hooks/useWindowSize";
import FeedHeader from "../FeedHeader";
import { showToast } from "@/components/common/Toast";
import { useQueryState } from "nuqs";
import { getSinglePost } from "@/api/community";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostFormSchema } from "@/constants/community";
import { z } from "zod";
import LottieLoader from "@/components/common/Loader/Lottie";

type PostModalProps = {
    isOpen: boolean;
    onClose: () => void;
    triggerReload?: () => void;
};

type FormData = z.infer<typeof PostFormSchema>;

type PostActionProps = {
    data: FormData;
    actionFn: (data: FormData) => Promise<any>;
    successMessage: string;
    errorMessage: string;
};

const PostModal = ({ isOpen, onClose, triggerReload }: PostModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const role = Cookies.get("role");
    const queryClient = useQueryClient();
    const [postId] = useQueryState("id");
    const [currentMode] = useQueryState("mode");
    const isEditMode = currentMode === "edit";

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues
    } = useForm<FormData>({
        resolver: zodResolver(PostFormSchema),
        defaultValues: {
            notes: "",
            uploadPictures: []
        }
    });

    const { isFetching } = useQuery({
        queryKey: ["getSinglePost", postId],
        queryFn: async () => {
            if(!postId) return null;
            const post = await getSinglePost(postId || "");
            if (post) {
                reset({
                    notes: post.description || "",
                    uploadPictures: post.images || []
                });
            }
            return post;
        },
        enabled: isEditMode && !!postId,
    });

    const handlePostAction = async ({
        data,
        actionFn,
        successMessage,
        errorMessage,
    }: PostActionProps) => {
        setIsSubmitting(true);
        try {
            const isSuccess = await actionFn(data);
            if (isSuccess) {
                showToast({ message: successMessage });
                if (triggerReload) triggerReload();
                queryClient.invalidateQueries({ queryKey: ["get-posts", "manage_your_posts"] });
                onClose();
                reset();
            } else {
                showToast({ message: errorMessage, type: "error" });
            }
        } catch (error) {
            showToast({ message: "Something went wrong!", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = (data: FormData) => {
        const payload = {
            description: data.notes,
            images: data.uploadPictures.map((image) => ({
                image_url: image.url,
                image_id: image.image_id,
            })),
            created_by: role,
        };

        const actionFn = isEditMode
            ? () => PUT_API(endpoints.post.updatePost(postId || ""), payload)
            : () => POST_API(endpoints.post.createPost, payload);

        const successMessage = isEditMode ? "Post updated successfully" : "Post created successfully";
        const errorMessage = isEditMode ? "Failed to update post" : "Failed to create post";

        handlePostAction({ 
            data, 
            actionFn, 
            successMessage, 
            errorMessage 
        });
    };

    const { width } = useWindowSize();
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    return (
        <CenterModal
            title={!isMobile ? (isEditMode ? "Edit Post" : "Add New Post") : ""}
            isOpen={isOpen}
            loading={isSubmitting}
            onClose={onClose}
            width={isMobile ? "100vw" : isTablet ? "60%" : "40%"}
            height={isMobile ? "100dvh" : "auto"}
            customClassName={cn(
                "max-h-[80vh] !rounded-2xl overflow-hidden [&_.ant-modal-footer]:!mt-0 [&_.modal-body]:!border-b [&_.modal-body]:!max-h-[80vh]",
                isMobile &&
                    "[&_.ant-modal-content]:!p-0 !p-0 !m-0 !h-[100dvh] !max-h-none !w-screen !max-w-none !max-h-[100dvh] !rounded-none"
            )}
            headerComponent={
                isMobile && (
                    <FeedHeader
                        title={isEditMode ? "Edit Post" : "Add New Post"}
                        onClose={onClose}
                        onSave={handleSubmit(onSubmit)}
                        isSubmitting={isSubmitting}
                    />
                )
            }
            hideFooter={isMobile}
            secondaryActionProps={{
                onClick: onClose,
                disabled: isSubmitting,
                title: "Cancel",
                btnVariant: "secondary",
                customClassName: cn("bg-transparent !text-black", "!rounded-xl"),
            }}
            primaryActionProps={{
                onClick: handleSubmit(onSubmit),
                disabled: isSubmitting,
                title: isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save" : "Create"),
                customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
            }}
        >
            {isFetching ? (
                <div className="flex-center min-h-[45vh]">
                    <LottieLoader isLoading={true} customClassName="w-[6rem] h-[6rem]" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 md:gap-2 p-4 md:p-0">
                    {CommunityFormConstants.map((field: any) => (
                        <Controller
                            key={field.name}
                            name={field.name as keyof FormData}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    {...field}
                                    error={errors[field.name as keyof FormData]?.message}
                                    value={value}
                                    onChange={onChange}
                                    rootClassName="bg-white p-2 rounded-xl !mb-0"
                                />
                            )}
                        />
                    ))}
                </form>
            )}
        </CenterModal>
    );
};

export default PostModal;
