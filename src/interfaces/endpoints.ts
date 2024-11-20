export interface EndpointProps {
  auth: {
    oauth2callback: string;
  };
  user: {
    signIn: string;
  };
  learner: {
    update: (id: string) => string;
  };
  volunteer: {
    update: (id: string) => string;
    getAllVolunteers: string;
  };
  volunteer_slot: {
    update: string;
    get: string;
    availableSlots: (id: string, date: string) => string;
  };
  session: {
    bookSession: string;
    getLearnerSessions: (id: string) => string;
    cancelSession: (id: string) => string;
  };
  post: {
    getPosts: string;
    createPost: string;
    getSinglePost: (post_id: string) => string;
  };
  comment: {
    createComment: string;
    getPostComments: (post_id: string) => string;
  };
}
