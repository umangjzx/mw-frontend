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
import CommentCard from "../CommentCard";
import MobileCommentPanel from "../MobileCommentPanel";
import SortDropdown from "../SortDropdown";
// import TimeAgo from "react-timeago";
// import englishStrings from "react-timeago/lib/language-strings/en";
// import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { DeleteIcon, EditIcon } from "@/assets/icons";
import EditResource from "../EditResource";

interface FeedCardProps {
    onClick: (postId: string) => void;
    isManagePost?: boolean;
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

const FeedCard = ({ onClick, isManagePost = false }: FeedCardProps) => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const queryClient = useQueryClient();
    const [comment, setComment] = useState<string>("");
    const role = Cookies.get("role");
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string>("recent");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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

    const toggleCommentPanel = (postId: string) => {
        if (activeCommentPostId === postId) {
            setActiveCommentPostId(null);
        } else {
            setActiveCommentPostId(postId);
        }
    };

    const handleCommentClick = (postId: string) => {
        // For mobile devices, show the sliding panel
        if (window.innerWidth < 768) {
            toggleCommentPanel(postId);
        } else {
            // For desktop, use the existing onClick behavior
            onClick(postId);
        }
    };

    const handleSort = (value: string) => {
        setSelectedSort(value);
        // Here you can add the sorting logic based on the selected value
        // For now, we'll just update the state
    };

    const handleEditClick = (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPostId(postId);
        setShowEditModal(true);
    };

    // Get the selected post data
    const selectedPost = posts.find((post) => post.post_id === selectedPostId);

    return (
        <div className="flex flex-col gap-6 w-full md:p-0 relative">
            <SortDropdown
                selectedSort={selectedSort}
                onSort={handleSort}
                isManagePost={isManagePost}
            />

            {posts.map((post) => (
                <div key={post.post_id} className="block w-full relative">
                    <div className="pr-2 md:pr-4 md:px-0">
                        {/* Profile and Name Section */}
                        <div className="flex items-start gap-2 md:gap-3 w-full p-2">
                            <div className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] relative flex-shrink-0 flex items-center justify-center">
                                <Image
                                    src={post.author.profile_picture?.image_url || DummyProfileImg}
                                    alt="profile picture"
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="(max-width: 768px) 32px, 40px"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between w-full min-h-[32px] md:min-h-[40px]">
                                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                        <p className="font-semibold text-sm md:text-base text-black">
                                            {post.author.name}
                                        </p>
                                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-black"></div>
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <TagComponent
                                                text={post.created_by}
                                                className="w-fit text-xs md:text-sm"
                                            />
                                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                            <p className="font-semibold text-sm md:text-base text-black">
                                                {/* TimeAgo components */}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isManagePost ? (
                                            <>
                                                <span
                                                    onClick={(e) =>
                                                        handleEditClick(post.post_id, e)
                                                    }
                                                    className="cursor-pointer md:hidden"
                                                >
                                                    <EditIcon />
                                                </span>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onClick(post.post_id);
                                                    }}
                                                    className="cursor-pointer md:hidden"
                                                >
                                                    <DeleteIcon />
                                                </span>
                                                <span
                                                    onClick={() => onClick(post.post_id)}
                                                    className="cursor-pointer hidden md:block"
                                                >
                                                    <MenuDot />
                                                </span>
                                            </>
                                        ) : (
                                            <span
                                                onClick={() => onClick(post.post_id)}
                                                className="cursor-pointer"
                                            >
                                                <MenuDot />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Content Section */}
                    <div className="mt-2 md:mt-3">
                        <div className="p-2 md:px-0">
                            <p className="text-xs md:text-sm font-normal">
                                {post.description}
                                {post.description.length > 150 && (
                                    <span
                                        onClick={() => onClick(post.post_id)}
                                        className="cursor-pointer text-primary font-medium text-[#ffac71]"
                                    >
                                        See More
                                    </span>
                                )}
                            </p>
                        </div>

                        {post.images.length > 0 && (
                            <div className="mt-2 md:mt-3 w-full h-[240px] md:h-[360px] 2xl:h-[400px] relative">
                                <Image
                                    src={post.images[0].image_url}
                                    alt="post image"
                                    fill
                                    onClick={() => onClick(post.post_id)}
                                    className="object-cover cursor-pointer"
                                />
                            </div>
                        )}

                        <div className="p-2 md:pr-4 md:px-0 mt-2 md:mt-3">
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-6">
                                    {/* Like button section */}
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
                                                        onClick={() =>
                                                            handleLike(post.post_id, true)
                                                        }
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
                                                        onClick={() =>
                                                            handleLike(post.post_id, false)
                                                        }
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
                                    {/* Comment button section */}
                                    <div
                                        onClick={() => handleCommentClick(post.post_id)}
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
                            {/* Only show comment input on desktop */}
                            <div className="hidden md:block">
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
                    </div>

                    {/* Mobile-only sliding comment panel */}
                    <AnimatePresence>
                        {activeCommentPostId === post.post_id && (
                            <MobileCommentPanel
                                postId={post.post_id}
                                totalComments={post.total_comments}
                                comment={comment}
                                setComment={setComment}
                                onClose={() => setActiveCommentPostId(null)}
                                handleComment={handleComment}
                            />
                        )}
                    </AnimatePresence>
                </div>
            ))}

            {/* Update the EditResource Modal */}
            <EditResource
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedPostId(null);
                }}
                
            >
                {selectedPost && (
                    <div className="p-4">
                        <textarea
                            className="w-full p-2 border rounded-md"
                            defaultValue={selectedPost.description}
                        />
                        {/* Add more fields as needed */}
                    </div>
                )}
            </EditResource>
        </div>
    );
};

export default FeedCard;
