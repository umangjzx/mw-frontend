import { EndpointProps } from "@/interfaces";

export const endpoints: EndpointProps = {
  auth: {
    oauth2callback: "auth/oauth2callback",
  },
  user: {
    signIn: "auth/signup",
  },
  learner: {
    update: (id: string) => `learner/${id}`,
  },
  volunteer: {
    update: (id: string) => `volunteer/${id}`,
    getAllVolunteers: "volunteer",
  },
  volunteer_slot: {
    update: "volunteer_slots",
    get: `volunteer_slots`,
    availableSlots: (id: string, date: string) =>
      `volunteer_slots/available_slots/${id}/${date}`,
  },
  session: {
    bookSession: "session",
    getLearnerSessions: (id: string) => `session/learner/${id}`,
    cancelSession: (id: string) => `session/${id}`,
  },
  post: {
    createPost: "post",
    getPosts: "post",
    getSinglePost: (post_id: string) => `post/${post_id}`,
  },
  comment: {
    createComment: "comment",
    getPostComments: (post_id: string) => `comment/${post_id}`,
  },
};
