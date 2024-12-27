interface CommentAuthor {
    name: string;
    profile_picture: {
        image_id: string;
        image_url: string;
    };
}

interface CommentData {
    author: CommentAuthor;
    author_id: string;
    comment_id: string;
    comment_text: string;
    created_at: string;
    created_by: string;
    parent_comment_id: string | null;
    post_id: string;
    replies: CommentData[];
}

interface CommentCardProps {
    reply?: boolean;
    comment: {
        comment_id: string;
        comment_text: string;
        created_at: string;
        created_by: string;
        is_liked: boolean;
        total_likes: number;
        author: {
            name: string;
            profile_picture: {
                image_url: string;
            };
        };
        parent_comment_id?: string;
    };
    onReply: (authorName: string, commentId: string) => void;
}
