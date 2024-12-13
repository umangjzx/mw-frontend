type EndpointProps = {
    onboarding: {
        update: (role: "volunteer" | "learner") => `onboarding/${typeof role}`;
    };
    auth: {
        oauth2callback: string;
    };
    user: {
        signIn: string;
    };
    learner: {
        update: (id: string) => string;
        getAllLearners: string;
    };
    volunteer: {
        update: (id: string) => string;
        getAllVolunteers: string;
        getIndividualVolunteer: (id: string) => string;
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
        getApprovalNotifications: (id: string, status: string) => string;
        updateNotificationStatus: (id: string) => string;
        getCalendarEvents: (id: string, month?: string) => string;
    };
    resources: {
        create: string;
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
};

type CommonPath = "skills" | "languages" | "subjects" | "media" | "categories" | "media-uploader";
