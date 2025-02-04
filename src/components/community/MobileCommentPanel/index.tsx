import { motion } from "framer-motion";
import CommentCard from "../CommentCard";
import CommentInput from "../CommentInput";

interface MobileCommentPanelProps {
    postId: string;
    totalComments: number;
    comment: string;
    setComment: (value: string) => void;
    onClose: () => void;
    handleComment: (postId: string) => void;
}

const MobileCommentPanel = ({
    postId,
    totalComments,
    comment,
    setComment,
    onClose,
    handleComment,
}: MobileCommentPanelProps) => {
    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-50 h-[90vh] md:hidden overflow-hidden rounded-t-[20px] shadow-lg flex flex-col"
        >
            {/* Header */}
            <div className="sticky top-0 bg-white p-4 border-b">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                        Comments ({totalComments})
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Scrollable Comments Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {/* Comments List */}
                    <div className="space-y-4">
                        <CommentCard
                            comment={{
                                comment_id: "1",
                                author: {
                                    name: "John Doe",
                                    profile_picture: {
                                        image_url: "/dummy-profile-image.jpg",
                                    },
                                },
                                created_by: "learner",
                                created_at: new Date().toISOString(),
                                comment_text: "This is a sample comment",
                                is_liked: false,
                                total_likes: 0,
                            }}
                            onReply={() => {}}
                            reply={false}
                        />
                    </div>
                </div>
            </div>

            {/* Fixed Comment Input at Bottom */}
            <div className="sticky bottom-0 bg-white border-t p-4">
                <CommentInput
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={false}
                    inputClassName="w-full"
                    onPost={() => handleComment(postId)}
                />
            </div>
        </motion.div>
    );
};

export default MobileCommentPanel; 