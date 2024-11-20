"use client";
import { endpoints } from "@/api/constants";
import { PostAPI, GetAPI } from "@/api/request";
import { getLocalStorage } from "@/utils/localStorage";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Post {
  post_id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
}

interface PostResponse {
  items: Post[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Post = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    return await GetAPI(endpoints.post.getPosts).then((res: any) => {
      return res;
    });
  };

  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const handlePost = () => {
    let payload = {
      title,
      description,
      created_by: getLocalStorage("role"),
    };
    PostAPI(endpoints.post.createPost, payload).then((res: any) => {
      setTitle("");
      setDescription("");
      refetch();
    });
  };

  const filteredPosts = posts?.data?.items?.filter(
    (post: Post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSinglePost = (id: string) => {
    router.push(`/post/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Create a New Post
          </h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>
            <button
              onClick={handlePost}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Create Post
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            All Posts
          </h2>
          <input
            className="w-full h-10 border border-gray-300 rounded-md px-3 mb-5"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {filteredPosts?.map((post: Post) => (
              <div
                onClick={() => handleSinglePost(post.post_id)}
                key={post.post_id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                <div className="text-xs text-gray-500">
                  <p>Posted by: {post.created_by}</p>
                  <p>Date: {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
