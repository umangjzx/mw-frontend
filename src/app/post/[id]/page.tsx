"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { GetAPI, PostAPI } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQuery } from "@tanstack/react-query";
import { getLocalStorage } from "@/utils/localStorage";

interface Comment {
  comment_id: string;
  comment_text: string;
  commented_by: string;
  post_id: string;
  parent_comment_id: string;
  author_id: string;
  created_at: string;
  replies: Comment[];
  author_details: {
    name: string;
  };
}

interface Post {
  post_id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
}

const SinglePost = () => {
  const [commentText, setCommentText] = useState("");
  const { id } = useParams();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchPost = async () => {
    return await GetAPI(endpoints.post.getSinglePost(id as string)).then(
      (res: any) => {
        return res;
      }
    );
  };

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: fetchPost,
  });

  const fetchComments = async () => {
    return await GetAPI(endpoints.comment.getPostComments(id as string)).then(
      (res: any) => res
    );
  };

  const {
    data: comments,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: fetchComments,
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    PostAPI(endpoints.comment.createComment, {
      comment_text: commentText,
      commented_by: getLocalStorage("role"),
      post_id: id,
      parent_comment_id: replyingTo || "",
    }).then((res: any) => {
      setCommentText("");
      setReplyingTo(null);
      refetchComments();
    });
  };

  const CommentItem = ({
    comment,
    level = 0,
  }: {
    comment: Comment;
    level?: number;
  }) => {
    return (
      <div
        className={`border-b pb-4 ${
          level > 0 ? "ml-8 border-l pl-4 border-gray-200" : ""
        }`}
      >
        <p className="text-gray-700">{comment.comment_text}</p>
        <div className="text-sm text-gray-500 mt-1 flex items-center">
          <span>{comment.author_details.name}</span>
          <span className="mx-2">•</span>
          <span>{new Date(comment.created_at).toLocaleDateString()}</span>
          {!comment.parent_comment_id && (
            <button
              onClick={() => {
                setReplyingTo(comment.comment_id);
                window.scrollTo({
                  top: document.querySelector("form")?.offsetTop,
                  behavior: "smooth",
                });
              }}
              className="ml-4 text-blue-500 hover:text-blue-600"
            >
              Reply
            </button>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.comment_id}
                comment={reply}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load post
      </div>
    );
  }

  if (!post?.data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Post not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">{post.data.title}</h1>
          <div className="text-gray-600 mb-6 text-sm">
            <span>Posted by: {post.data.created_by}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.data.created_at).toLocaleDateString()}</span>
          </div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">
              {post.data.description}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center"></div>
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>

          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder={
                replyingTo ? "Write a reply..." : "Write a comment..."
              }
              rows={3}
            />
            <div className="mt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {replyingTo ? "Post Reply" : "Post Comment"}
              </button>
              {replyingTo && (
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel Reply
                </button>
              )}
            </div>
          </form>

          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : (
            <div className="space-y-4">
              {comments?.data?.items
                ?.filter((comment: Comment) => !comment.parent_comment_id)
                .map((comment: Comment) => (
                  <CommentItem key={comment.comment_id} comment={comment} />
                ))}
              {(!comments?.data?.items || comments.data.items.length === 0) && (
                <p className="text-gray-500">No comments yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
