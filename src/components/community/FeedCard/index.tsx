"use client";
import Image from "next/image";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import TagComponent from "@/components/common/Tag";
import MenuDot from "@/assets/icons/MenuDot";
import FeedImg from "@/assets/images/FeedImage.png";
import { HeartLikeIcon, UnlikeHeartIcon } from "@/assets/icons";
import CommentIcon from "@/assets/icons/CommentIcon";
import SaveIcon from "@/assets/icons/SaveIcon";
import { endpoints } from "@/api/constants";
import { DELETE_API, GET_API, POST_API } from "@/api/request";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { motion, AnimatePresence } from "framer-motion";
import CommentInput from "../CommentInput";
import Cookies from "js-cookie";
import { showToast } from "@/components/common/Toast";
// import TimeAgo from "react-timeago";
// import englishStrings from "react-timeago/lib/language-strings/en";
// import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

interface FeedCardProps {
    onClick: (postId: string) => void;
}

interface Author {
    name: string;
    profile_picture: {
        image_url: string;
    };
}

interface PostData {
    post_id: string;
    description: string;
    author: Author;
    created_at: string;
    created_by: string;
    images: Array<{ image_url: string }>;
    is_liked: boolean;
    total_likes: number;
    total_comments: number;
}

interface PostResponse {
    items: PostData[];
    page: number;
    size: number;
    total: number;
}

const FeedCard = ({ onClick }: FeedCardProps) => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const queryClient = useQueryClient();
    const [comment, setComment] = useState<string>("");
    const role = Cookies.get("role");
    const getPosts = async () => {
        const response = await GET_API(endpoints.post.getPosts);
        setPosts(response.data.items);
        return response.data;
    };

    const { data, isLoading, isError } = useQuery<PostResponse>({
        queryKey: ["get-posts"],
        queryFn: getPosts,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading posts</div>;
    // const formatter = buildFormatter(englishStrings);

    const handleLike = (postId: string, currentLikeStatus: boolean) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.post_id === postId) {
                    return {
                        ...post,
                        is_liked: !currentLikeStatus,
                        total_likes: currentLikeStatus
                            ? post.total_likes - 1
                            : post.total_likes + 1,
                    };
                }
                return post;
            })
        );

        if (!currentLikeStatus) {
            POST_API(endpoints.post.like(postId)).then(() => {
                queryClient.invalidateQueries({ queryKey: ["get-posts"] });
            });
        } else {
            DELETE_API(endpoints.post.like(postId)).then(() => {
                queryClient.invalidateQueries({ queryKey: ["get-posts"] });
            });
        }
    };

    const handleComment = (postId: string) => {
        let payload = {
            comment_text: comment,
            created_by: role,
            post_id: postId,
            parent_id: "",
        };
        POST_API(endpoints.comment.createComment, payload)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["get-posts"] });
                setComment("");
                showToast({
                    message: "Comment posted successfully",
                    type: "success",
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            {posts.map((post) => (
                <div key={post.post_id} className="flex w-full">
                    <div className="w-[40px] h-[40px] relative flex-shrink-0">
                        <Image
                            src={post.author.profile_picture?.image_url || DummyProfileImg}
                            alt="profile picture"
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="ml-3 flex-1 flex flex-col gap-3">
                        <div className="flex items-center justify-between w-full min-h-[40px]">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-black">{post.author.name}</p>
                                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                <TagComponent text={post.created_by} className="w-fit" />
                                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                <p className="font-semibold text-black">
                                    {/* <TimeAgo date={post.created_at} formatter={formatter} /> */}
                                    {/* <ReactTimeAgo date={new Date(post.created_at)} locale="en-US" /> */}
                                </p>
                            </div>
                            <span onClick={() => onClick(post.post_id)} className="cursor-pointer">
                                <MenuDot />
                            </span>
                        </div>
                        <p className="text-sm font-normal">
                            {post.description}
                            {post.description.length > 150 && (
                                <span onClick={() => onClick(post.post_id)} className="cursor-pointer text-primary font-medium text-[#ffac71]">
                                    {" "}
                                    See More
                                </span>
                            )}
                        </p>
                        {post.images.length > 0 && (
                            <div className="w-full h-[360px] 2xl:h-[400px] mx-auto relative">
                                <Image
                                    src={post.images[0].image_url}
                                    alt="post image"
                                    fill
                                    onClick={() => onClick(post.post_id)}
                                    className="object-cover rounded-xl cursor-pointer"
                                />
                            </div>
                        )}
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 cursor-pointer w-10">
                                    <div>
                                        <AnimatePresence mode="wait">
                                            {post.is_liked ? (
                                                <motion.div
                                                    key="liked"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: "easeInOut",
                                                    }}
                                                    onClick={() => handleLike(post.post_id, true)}
                                                >
                                                    <HeartLikeIcon />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="unliked"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: "easeInOut",
                                                    }}
                                                    onClick={() => handleLike(post.post_id, false)}
                                                >
                                                    <UnlikeHeartIcon />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <motion.p
                                        className="font-medium text-[#EF4444]"
                                        animate={{
                                            scale: post.is_liked ? [1, 1.2, 1] : 1,
                                            opacity: post.is_liked ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {post.total_likes}
                                    </motion.p>
                                </div>
                                <div
                                    onClick={() => onClick(post.post_id)}
                                    className="flex items-center gap-1 cursor-pointer"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CommentIcon />
                                    </motion.div>
                                    <motion.p
                                        className="font-medium text-black"
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.1 }}
                                        animate={{
                                            scale: post.total_comments > 0 ? [1, 1.1, 1] : 1,
                                            opacity: post.total_comments > 0 ? 1 : 0.7,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {post.total_comments}
                                    </motion.p>
                                </div>
                            </div>
                            <SaveIcon />
                        </div>
                        <CommentInput
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={false}
                            inputClassName=""
                            onPost={() => handleComment(post.post_id)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedCard;
