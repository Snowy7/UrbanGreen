import PendingRequests from '@/screens/admin/PendingRequests/PendingRequests';
//auth screens
export { default as Login } from './auth/Login/Login';
export { default as Signup } from './auth/Signup/Signup';
export { default as OTPVerification } from './auth/OTPVerification/OTPVerification';

//home screens
export { default as Home } from '@/screens/main/Home/Home';
export { default as Profile } from '@/screens/main/Profile/Profile';
export { default as Settings } from '@/screens/main/Settings/Settings';
export { default as SubmitContentRequest } from '@/screens/main/Profile/SubmitContentRequest/SubmitContentRequest';
export { default as ContentRequests } from '@/screens/main/Profile/ContentRequests/ContentRequests';
export { default as EditAccount } from '@/screens/main/Profile/EditAccount';
export { default as GreenSpaces } from '@/screens/main/GreenSpaces/GreenSpaces';
export { default as Events } from '@/screens/main/Events/Events';
export { default as GreenSpaceDetails } from '@/screens/main/GreenSpaces/GreenSpaceDetails';
export { default as EventDetails } from '@/screens/main/Events/EventDetails';
export { default as Favorites } from '@/screens/main/Favorites/Favorites';
export { default as JoinedEvents } from '@/screens/main/JoinedEvents/JoinedEvents';
//admin screens
export { default as AdminHome } from '@/screens/admin/Home/Home';
export { default as AdminGreenspace } from '@/screens/admin/Greenspace/Greenspace';
export { default as AdminEvents } from '@/screens/admin/Events/Events';
export { default as PendingRequests } from '@/screens/admin/PendingRequests/PendingRequests';
export { default as AdminRequestDetails } from '@/screens/admin/PendingRequests/RequestDetails';