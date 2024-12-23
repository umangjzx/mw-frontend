type UserType = "volunteer" | "learner";

export const endpoints: EndpointProps = {
    onboarding: {
        update: (role: "volunteer" | "learner") => `onboarding/${role}`,
        getOnboardingStatus: (id: string, role: "volunteer" | "learner") =>
            `onboarding/status/${role}/${id}`,
    },
    auth: {
        oauth2callback: "auth/oauth2callback",
    },
    user: {
        signIn: "auth/signup",
    },
    learner: {
        update: (id: string) => `learner/${id}`,
        getAllLearners: "learner",
        getIndividualLearner: (id: string) => `learner/${id}`,
        getConnectedVolunteers: (id: string) => `learner/${id}/connected_volunteers`,
    },
    volunteer: {
        update: (id: string) => `volunteers/${id}`,
        getAllVolunteers: "volunteers",
        getIndividualVolunteer: (id: string) => `volunteers/${id}`,
        getConnectedLearners: (id: string) => `volunteers/${id}/connected_learners`,
    },
    volunteer_slot: {
        update: "volunteer_slots",
        get: `volunteer_slots`,
        availableSlots: (id: string, date: string) =>
            `volunteer_slots/available_slots/${id}/${date}`,
        availableDays: (id: string) => `volunteer_slots/available_days/${id}`,
    },
    session: {
        bookSession: "session",
        getLearnerSessions: (id: string) => `session/learner/${id}`,
        cancelSession: (id: string) => `session/${id}`,
        getApprovalNotifications: (id: string, status: string) =>
            `session/volunteer/${id}?status=${status}`,
        getCalendarEvents: (id: string, userType: UserType, month?: string, status?: string) =>
            `session/${userType}/${id}${month ? `?month=${month}` : ""}${
                status ? `?status=${status}` : ""
            }`,
        updateNotificationStatus: (id: string) => `session/${id}`,
        markAsCompleted: (id: string) => `session/${id}/mark_as_completed`,
    },
    volunteer_chat: {
        sendMessage: (id: string) => `chat/message/learner/${id}`,
        getMessages: (id: string) => `chat/messages/learner/${id}`
    },
    learner_chat: {
        sendMessage: (id: string) => `chat/message/volunteer/${id}`,
        getMessages: (id: string) => `chat/messages/volunteer/${id}`
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
    common: (path: CommonPath) => `common/${path}`,
    resources: {
        create: "resource",
    },
    volunterFeedback: {
        create: "feedback/volunteer",
        get: (id: string) => `feedback/volunteer/${id}`,
        update: "feedback/volunteer",
    },
    learnerFeedback: {
        create: "feedback/learner",
        get: (id: string) => `feedback/learner/${id}`,
        update: "feedback/learner",
    },
};
