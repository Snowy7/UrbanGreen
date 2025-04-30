import { Id } from 'convex/_generated/dataModel';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Admin: undefined;
};

export type AuthStackParamList = {
  Onboard: undefined;
  Login: undefined;
  Signup: undefined;
  OTPVerification: {
    email: string;
    phone: string;
    type: string;
    firstName: string;
    lastName: string;
  };
};

export type MainStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  GreenSpaces: undefined;
  Events: undefined;
  Favorites: undefined;
  JoinedEvents: undefined;
  Profile: undefined;
  EditAccount: undefined;
  SubmitContentRequest: undefined;
  ContentRequests: undefined;
  AddEventForm: undefined;
  AddGreenSpaceForm: undefined;
  UpdateGreenSpaceForm: undefined;
  GreenSpaceDetails: { id: string };
  EventDetails: { id: string };
  GreenSpaceMap: {
    id: string;
  };
};

export type AdminStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Greenspace: undefined;
  Events: undefined;
  AddEvent: undefined;
  UpdateEvent: { id: string };
  EventDetails: { id: string };
  PendingRequests: undefined;
  Notifications: undefined;
  Profile: undefined;
  EditAccount: undefined;
  AddGreenspace: undefined;
  UpdateGreenspace: { id: string };
  GreenspaceDetails: { id: string };
  RequestDetails: { requestId: Id<"contentRequests"> };
};