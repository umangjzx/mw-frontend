"use client";

import ViewModal from "@/components/common/Modals/ViewModal";
import FeedImg from "@/assets/images/FeedImage.png";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Image from "next/image";
import TagComponent from "@/components/common/Tag";
import Divider from "@/components/common/Divider";
import CommentCard from "@/components/community/CommentCard";
import { DeleteIcon, EditIcon, FeedModalCloseIcon } from "@/assets/icons";
import ReportIcon from "@/assets/icons/ReportIcon";

import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/constants";
import { GET_API, DELETE_API } from "@/api/request";
import CommentInput from "../CommentInput";
import React, { useState } from "react";
import { POST_API } from "@/api/request";
import { callbackToast } from "@/components/common/Toast";
import Cookies from "js-cookie";
import { IoIosClose } from "react-icons/io";
import LottieLoader from "@/components/common/Loader/Lottie";
import CommentSkeleton from "../CommentCard/skeleton";
import ErrorMsg from "@/components/common/Messages/ErrorMsg";
import { useQueryState } from "nuqs";
import { BsFillBookmarkFill, BsBookmark } from "react-icons/bs";

type FeedViewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    handleReportClick?: (id: string) => void;
    isManagePost?: boolean;
};

interface PostData {
    description: string;
    images: {
        image_url: string;
        image_id: string;
    }[];
    created_by: string;
    post_id: string;
    author: {
        name: string;
        profile_picture: {
            image_url: string;
            image_id: string;
        };
    };
    created_at: string;
    is_liked: boolean;
    is_saved: boolean;
    total_likes: number;
    total_comments: number;
}

const FeedViewModal = ({
    isOpen,
    onClose,
    handleReportClick,
    isManagePost,
}: FeedViewModalProps) => {
    const queryClient = useQueryClient();
    const [activeTab] = useQueryState("tab");
    const [mode] = useQueryState("mode");
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const role = Cookies.get("role");

    const [comment, setComment] = useState("");
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    
    const [replyTo, setReplyTo] = useState({
        name: "",
        id: "",
    });

    const getIndividualPost = async () => {
        const response = await GET_API(endpoints.post.getSinglePost(id as string));
        return response.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-single-post", id],
        queryFn: getIndividualPost,
        enabled: !!id && (mode === "view"),
    });

    const getPostComments = async () => {
        const response = await GET_API(endpoints.comment.getPostComments(id as string));
        return response.data;
    };

    const {
        data: commentsData,
        isLoading: commentsLoading,
        isError: commentsError,
    } = useQuery({
        queryKey: ["get-post-comments", id],
        queryFn: getPostComments,
        enabled: !!id,
    });

    const post = data as PostData;

    const handleCloseModal = () => {
        onClose();
    };

    const handleReplyName = (name: string, id: string) => {
        setReplyTo({ name, id });
    };

    const handleSavePost = (postId: string, currentSaveStatus: boolean) => {
        queryClient.setQueryData(["posts", activeTab], (oldData: any) => {
            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    items: page.items.map((post: PostData) =>
                        post.post_id === postId
                            ? {
                                  ...post,
                                  is_saved: !currentSaveStatus,
                              }
                            : post
                    ),
                })),
            };
        });

        if (currentSaveStatus) {
            DELETE_API(endpoints.post.unsave(postId)).then(() => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                queryClient.invalidateQueries({ queryKey: ["get-post"] });
            });
        } else {
            POST_API(endpoints.post.save(postId)).then(() => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                queryClient.invalidateQueries({ queryKey: ["get-post"] });
            });
        }
    };

    const handleComment = async (postId: string) => {
        setIsCommentLoading(true);

        let payload = {
            comment_text: comment,
            created_by: role,
            post_id: postId,
            parent_comment_id: replyTo.id || "",
        };
        await callbackToast({
            apiCall: POST_API(endpoints.comment.createComment, payload),
            loadingMsg: "Posting Comment",
            successMsg: "Comment Posted Successfully",
            errorMsg: "Failed to Post Comment",
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["get-post-comments", id] });
            setComment("");
            setIsCommentLoading(false);
        });
    };

    const handleReplyClose = () => {
        setReplyTo({ name: "", id: "" });
    };

    const handleLike = (postId: string) => {
        // Optimistic update for the modal view
        queryClient.setQueryData(["get-post", id], (oldData: any) => ({
            ...oldData,
            is_liked: !oldData.is_liked,
            total_likes: oldData.is_liked ? oldData.total_likes - 1 : oldData.total_likes + 1,
        }));

        // Also update the post in the main feed
        queryClient.setQueryData(["posts", activeTab], (oldData: any) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    items: page.items.map((post: PostData) =>
                        post.post_id === postId
                            ? {
                                  ...post,
                                  is_liked: !post.is_liked,
                                  total_likes: post.is_liked
                                      ? post.total_likes - 1
                                      : post.total_likes + 1,
                              }
                            : post
                    ),
                })),
            };
        });

        // Make API call
        if (!post.is_liked) {
            POST_API(endpoints.post.like(postId)).then(() => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                queryClient.invalidateQueries({ queryKey: ["get-post"] });
            });
        } else {
            DELETE_API(endpoints.post.like(postId)).then(() => {
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                queryClient.invalidateQueries({ queryKey: ["get-post"] });
            });
        }
    };

    return (
        <ViewModal
            className="md:!h-[90vh] lg:!h-[720px]"
            modalOpen={isOpen}
            onClose={handleCloseModal}
            width={1200}
            height="720px"
            showCloseIcon={isError}
        >
            {isLoading ? (
                <div className="h-full w-full min-h-[80vh] flex-center">
                    <LottieLoader isLoading={true} />
                </div>
            ) : isError ? (
                <ErrorMsg />
            ) : (
                <div className="grid lg:grid-cols-[1fr,0.7fr] h-[720px]">
                    <div className="relative w-full md:h-[250px] lg:h-[720px]">
                        <Image
                            src={post?.images[0]?.image_url}
                            alt="feed image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col lg:h-[720px] relative">
                        <div className="flex justify-end items-center px-5 pb-2 pt-5 gap-3">
                            {isManagePost ? (
                                <div className="flex items-center gap-2">
                                    <span
                                        // onClick={(e) => handleEditClick(post.post_id, e)}
                                        className="cursor-pointer"
                                    >
                                        <EditIcon width={40} height={40} />
                                    </span>
                                    <span onClick={() => {}} className="cursor-pointer">
                                        <DeleteIcon width={40} height={40} />
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleSavePost(post?.post_id, post?.is_saved)
                                        }
                                    >
                                        {post?.is_saved ? (
                                            <BsFillBookmarkFill size={20} />
                                        ) : (
                                            <BsBookmark size={20} />
                                        )}
                                    </span>
                                    <span
                                        className="cursor-pointer border rounded-full"
                                        onClick={() => handleReportClick?.(post?.post_id)}
                                    >
                                        <ReportIcon />
                                    </span>
                                </div>
                            )}
                            <FeedModalCloseIcon
                                className="cursor-pointer"
                                onClick={handleCloseModal}
                            />
                        </div>
                        <Divider />
                        <div className="px-7 flex flex-col flex-1 overflow-hidden mt-3">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <div className="w-[40px] h-[40px] relative flex-shrink-0">
                                        <Image
                                            src={post?.author?.profile_picture?.image_url}
                                            alt="profile picture"
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="ml-3 flex-1 flex flex-col ">
                                        <div className="flex items-center gap-3 w-full min-h-[40px]">
                                            <p className="font-semibold text-black">
                                                {post?.author?.name}
                                            </p>
                                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                            <TagComponent
                                                text={post?.created_by}
                                                className="w-fit capitalize"
                                            />
                                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                            <p className="font-semibold text-black">
                                                {new Date(post?.created_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <p className="text-sm font-normal">{post?.description}</p>
                                    </div>
                                </div>
                                <Divider />
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden mt-3">
                                <h3 className="text-xl font-semibold text-black mb-3">Comments</h3>
                                <div className="flex flex-col gap-3 overflow-y-auto flex-1 pb-[75px] pr-3 hide-scrollbar">
                                    {commentsLoading ? (
                                        <div className="flex flex-col gap-3">
                                            <CommentSkeleton size={8} />
                                        </div>
                                    ) : (
                                        commentsData?.items.map((comment: any) => (
                                            <React.Fragment key={comment.comment_id}>
                                                <CommentCard
                                                    comment={comment}
                                                    onReply={handleReplyName}
                                                />
                                                {comment.replies?.map((reply: any) => (
                                                    <CommentCard
                                                        key={reply.comment_id}
                                                        comment={reply}
                                                        reply
                                                        onReply={handleReplyName}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        ))
                                    )}
                                    {commentsData?.items.length === 0 && (
                                        <div className="flex-center h-full w-full">
                                            <p className="text-md font-normal text-center">
                                                No comments yet
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 border-stroke bg-white px-7 py-4 border-t border-gray-100 z-50">
                            {replyTo.name && (
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium text-gray-light">
                                        Replying to {replyTo.name}
                                    </p>
                                    <span
                                        onClick={handleReplyClose}
                                        className="cursor-pointer text-gray-light"
                                    >
                                        <IoIosClose />
                                    </span>
                                </div>
                            )}
                            <CommentInput
                                onPost={() => handleComment(post?.post_id)}
                                name="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isCommentLoading}
                                inputClassName=""
                            />
                        </div>
                    </div>
                </div>
            )}
        </ViewModal>
    );
};

export default FeedViewModal;
