type EndpointProps = {
    onboarding: {
        update: (role: "volunteer" | "learner") => `onboarding/${typeof role}`;
        getOnboardingStatus: (id: string, role: "volunteer" | "learner") => string;
        setLearnerOnboardingStatus: (id: string) => string;
    };
    auth: {
        oauth2callback: string;
        checkCalendarScope: string;
        revokeGoogleAuth: string;
    };
    user: {
        signIn: string;
    };
    learner: {
        update: (id: string) => string;
        getAllLearners: string;
        getIndividualLearner: (id: string) => string;
        getConnectedVolunteers: (id: string) => string;
    };
    volunteer: {
        update: (id: string) => string;
        getAllVolunteers: string;
        getIndividualVolunteer: (id: string) => string;
        getConnectedLearners: (id: string) => string;
    };
    volunteer_slot: {
        update: string;
        get: string;
        availableSlots: (id: string, date: string) => string;
        availableDays: (id: string) => string;
    };
    session: {
        bookSession: string;
        getLearnerSessions: (id: string) => string;
        cancelSession: (id: string) => string;
        getApprovalNotifications: (id: string, status: string) => string;
        updateNotificationStatus: (id: string) => string;
        getCalendarEvents: (
            id: string,
            userType: "volunteer" | "learner",
            month?: string,
            status?: string
        ) => string;
        markAsCompleted: (id: string) => string;
    };
    volunteer_chat: {
        sendMessage: (id: string) => string;
        getMessages: (id: string) => string;
    };
    learner_chat: {
        sendMessage: (id: string) => string;
        getMessages: (id: string) => string;
    };
    resources: {
        create: string;
        get: string;
        getResource: (resource_id: string) => string,
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
    common: (path: CommonPath) => string;
    volunterFeedback: {
        create: string;
        get: (id: string) => string;
        update: string;
    };
    learnerFeedback: {
        create: string;
        get: (id: string) => string;
        update: string;
    };
    media_uploader: {
        image: string;
        video: string;
        document: string;
        deleteImage: (id: string) => string;
        deleteVideo: (id: string) => string;
        deleteDocument: (id: string) => string;
    };
};

type CommonPath = "skills" | "languages" | "subjects" | "media" | "categories";
