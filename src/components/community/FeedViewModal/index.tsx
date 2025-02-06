"use client";

import ViewModal from "@/components/common/Modals/ViewModal";
import FeedImg from "@/assets/images/FeedImage.png";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Image from "next/image";
import TagComponent from "@/components/common/Tag";
import Divider from "@/components/common/Divider";
import CommentCard from "@/components/community/CommentCard";
import { FeedModalCloseIcon } from "@/assets/icons";
import ReportIcon from "@/assets/icons/ReportIcon";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import CommentInput from "../CommentInput";
import React, { useState } from "react";
import { POST_API } from "@/api/request";
import { showToast } from "@/components/common/Toast";
import Cookies from "js-cookie";
import { IoIosClose } from "react-icons/io";

type FeedViewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    handleReportClick?: (id: string) => void;
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
    total_likes: number;
    total_comments: number;
}

const FeedViewModal = ({ isOpen, onClose, handleReportClick }: FeedViewModalProps) => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();
    const role = Cookies.get("role");
    const [replyTo, setReplyTo] = useState({
        name: "",
        id: "",
    });

    console.log(replyTo, "REPLY TO STATE");

    const getIndividualPost = async () => {
        const response = await GET_API(endpoints.post.getSinglePost(id as string));
        return response.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-post", id],
        queryFn: getIndividualPost,
        enabled: !!id,
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

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading posts</div>;

    const post = data as PostData;

    const handleCloseModal = () => {
        onClose();
    };

    const handleReplyName = (name: string, id: string) => {
        setReplyTo({ name, id });
    };

    const handleComment = (postId: string) => {
        let payload = {
            comment_text: comment,
            created_by: role,
            post_id: postId,
            parent_comment_id: replyTo.id || "",
        };
        POST_API(endpoints.comment.createComment, payload)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["get-post-comments"] });
                setComment("");
                handleReplyClose();
                showToast({
                    message: "Comment posted successfully",
                    type: "success",
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleReplyClose = () => {
        setReplyTo({ name: "", id: "" });
    };

    return (
        <ViewModal
            className="md:!h-[90vh] lg:!h-[720px]"
            modalOpen={isOpen}
            onClose={handleCloseModal}
            width={1200}
            height="720px"
        >
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
                        <span
                            className="cursor-pointer"
                            onClick={() => handleReportClick?.(post?.post_id)}
                        >
                            <ReportIcon />
                        </span>
                        <FeedModalCloseIcon className="cursor-pointer" onClick={handleCloseModal} />
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
                                {commentsData?.items.map((comment: any) => (
                                    <React.Fragment key={comment.comment_id}>
                                        <CommentCard comment={comment} onReply={handleReplyName} />
                                        {comment.replies?.map((reply: any) => (
                                            <CommentCard
                                                key={reply.comment_id}
                                                comment={reply}
                                                reply
                                                onReply={handleReplyName}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
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
                            disabled={false}
                            inputClassName=""
                        />
                    </div>
                </div>
            </div>
        </ViewModal>
    );
};

export default FeedViewModal;
