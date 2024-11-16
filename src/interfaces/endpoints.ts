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
  };
  volunteer_slot: {
    update: (id: string) => string;
    get: (id: string) => string;
  };
}
