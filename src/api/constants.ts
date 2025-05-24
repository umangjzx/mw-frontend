import { EndpointProps } from "@/interfaces/endpoints";

type UserType = "volunteer" | "learner";
type CommonPath = "skills" | "languages" | "subjects" | "media" | "categories";

export const endpoints: EndpointProps = {
    onboarding: {
        update: (role: "volunteer" | "learner") => `onboarding/${role}`,
        getOnboardingStatus: (id: string, role: "volunteer" | "learner") =>
            `onboarding/status/${role}/${id}`,
        setLearnerOnboardingStatus: (id: string) =>
            `onboarding/update_verification_status/learner/${id}?verification_status=verification_completed`,
    },
    auth: {
        oauth2callback: "auth/oauth2callback",
        checkCalendarScope: "auth/check_calendar_scope",
        revokeGoogleAuth: "auth/revoke_google_auth",
    },
    user: {
        signIn: "auth/signup",
        login: "auth/login",
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
        getApprovalNotifications: (id: string) => `session/pending_invites/${id}`,
        getCalendarEvents: (id: string, userType: UserType, month?: string, status?: string) =>
            `session/${userType}/${id}${month ? `?month=${month}` : ""}${
                status ? `?status=${status}` : ""
            }`,
        updateNotificationStatus: (id: string) => `session/${id}`,
        markAsCompleted: (id: string) => `session/${id}/mark_as_completed`,
    },
    volunteer_chat: {
        sendMessage: (id: string) => `chat/message/learner/${id}`,
        getMessages: (id: string) => `chat/messages/learner/${id}`,
    },
    learner_chat: {
        sendMessage: (id: string) => `chat/message/volunteer/${id}`,
        getMessages: (id: string) => `chat/messages/volunteer/${id}`,
    },
    post: {
        createPost: "post",
        getPosts: "post",
        getMyPosts: "post/my_posts/all",
        getSavedPosts: "post/saved_posts/all",
        getSinglePost: (post_id: string) => `post/${post_id}`,
        like: (post_id: string) => `post/${post_id}/like`,
        unlike: (post_id: string) => `post/${post_id}/unlike`,
        save: (post_id: string) => `post/${post_id}/save`,
        unsave: (post_id: string) => `post/${post_id}/unsave`,
        getNotifications: "post/notifications/all",
        readNotifications: "post/notifications/read",
        updatePost: (id: string) => `/post/${id}`,
        deletePost: (id: string) => `/post/${id}`,
    },
    comment: {
        createComment: "comment",
        getPostComments: (post_id: string) => `comment/${post_id}`,
        commentLikes: (comment_id: string) => `comment/${comment_id}/like`,
    },
    common: (path: CommonPath) => `common/${path}/`,
    resources: {
        create: "resource",
        get: "resource",
        getMyResources: "resource/myresources",
        getResourcesByCategory: (category: string) => `resource/categories/${category}`,
        getCategories: "resource/categories/all",
        getResource: (resource_id: string) => `resource/${resource_id}`,
        delete: (resource_id: string) => `resource/${resource_id}`,
        update: (resource_id: string) => `resource/${resource_id}`,
        like: (resource_id: string) => `resource/${resource_id}/like`,
        dislike: (resource_id: string) => `resource/${resource_id}/like`,
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
    report: {
        create: "report",
    },
    media_uploader: {
        image: "common/media_uploader/image",
        video: "common/media_uploader/video",
        document: "common/media_uploader/document",
        deleteImage: (id: string) => `common/media_uploader/image/${id}`,
        deleteVideo: (id: string) => `common/media_uploader/video/${id}`,
        deleteDocument: (id: string) => `common/media_uploader/document/${id}`,
    },
    chat: {
        createChatForVolunteer: (volunteerId: string) => `chat/volunteer/${volunteerId}`,
        createChatForLearner: (learnerId: string) => `chat/learner/${learnerId}`,
        sendMessageToVolunteer: (volunteerId: string) => `chat/message/volunteer/${volunteerId}`,
        sendMessageToLearner: (learnerId: string) => `chat/message/learner/${learnerId}`,
        getMessagesForVolunteer: (volunteerId: string) => `chat/messages/volunteer/${volunteerId}`,
        getMessagesForLearner: (learnerId: string) => `chat/messages/learner/${learnerId}`,
        getAllchatsOfVolunteer: (volunteerId: string) => `chat/all/volunteer/${volunteerId}`,
        getAllchatsOfLearner: (learnerId: string) => `chat/all/learner/${learnerId}`,
        getIndividualChat: (chatId: string) => `chat/chat/${chatId}`,
        readMessage: `chat/message/read`,
        volunteerPermission: (id: string) => `volunteers/${id}/chat_permission`,
        learnerPermission: (id: string) => `learner/${id}/chat_permission`,
    },
};
