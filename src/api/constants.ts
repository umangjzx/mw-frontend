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
    },
    volunteer: {
        update: (id: string) => `volunteers/${id}`,
        getAllVolunteers: "volunteers",
        getIndividualVolunteer: (id: string) => `volunteers/${id}`,
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
        getApprovalNotifications: (id: string, status: string) =>
            `session/volunteer/${id}?status=${status}`,
        getCalendarEvents: (id: string, userType: UserType, month?: string, status?: string) =>
            `session/${userType}/${id}${month ? `?month=${month}` : ""}${
                status ? `?status=${status}` : ""
            }`,
        updateNotificationStatus: (id: string) => `session/${id}`,
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
        get: "feedback/volunteer",
        update: "feedback/volunteer",
    },
    learnerFeedback: {
        create: "feedback/learner",
        get: "feedback/learner",
        update: "feedback/learner",
    },
};
