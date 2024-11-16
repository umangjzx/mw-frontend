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
  },
  volunteer_slot: {
    update: (id: string) => `volunteer_slot/${id}`,
    get: (id: string) => `volunteer_slot/${id}`,
  },
};
