import {
  EventsIcon,
  FavoritesIcon,
  GreenspaceIcon,
  HomeIcon,
  JoinedEventsIcon,
  ProfileIcon,
} from "@/assets/icons";
import { EditAccount, EventDetails, GreenSpaceDetails, Home, JoinedEvents } from "@/screens";
import Profile from "@/screens/main/Profile/Profile";
import SubmitContentRequest from "@/screens/main/Profile/SubmitContentRequest/SubmitContentRequest";
import ContentRequests from "@/screens/main/Profile/ContentRequests/ContentRequests";
import AddEventForm from "@/screens/main/Profile/SubmitContentRequest/AddEventForm";
import AddGreenSpaceForm from "@/screens/main/Profile/SubmitContentRequest/AddGreenSpaceForm";
import UpdateGreenSpaceForm from "@/screens/main/Profile/SubmitContentRequest/UpdateGreenSpaceForm";
import { Colors } from "@/styles/colors";
import fontFamily from "@/styles/fontFamily";
import { moderateScale } from "@/styles/scaling";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";
import MyTabBar from "./MyTabBar";
import { MainStackParamList } from "./types";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GreenSpaces from '@/screens/main/GreenSpaces/GreenSpaces';
import Events from '@/screens/main/Events/Events';
import Favorites from '@/screens/main/Favorites/Favorites';
import GreenSpaceMap from '@/screens/main/GreenSpaces/GreenSpaceMap';
const Tab = createBottomTabNavigator<MainStackParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Placeholder components for new screens
const Gardens = () => null;
const Tasks = () => null;

const TabNavigator = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarShowLabel: false,
  };

  const iconSize = moderateScale(26);

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBar={(props) => <MyTabBar {...props} />}
      id={undefined}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={['#006837', '#3B903A', "#8CC63F", "#8CC63F"]}
                locations={[0.11, 0.57, 0.75, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: moderateScale(100), padding: moderateScale(10) }}
              >
                <HomeIcon color="#ffffff" width={iconSize} height={iconSize} />
              </LinearGradient>
            : <HomeIcon color="#999999" width={iconSize} height={iconSize} />,
        }}
      />
      <Tab.Screen
        name="GreenSpaces"
        component={GreenSpaces}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={["#8CC63F", "#46983C", "#006837"]}
                start={{ x: 0.06, y: 0.06 }}
                end={{ x: 0.92, y: 0.9 }}
                style={{ borderRadius: moderateScale(100), padding: moderateScale(10) }}
              >
                <GreenspaceIcon color="#ffffff" width={iconSize} height={iconSize} />
              </LinearGradient>
            : <GreenspaceIcon color="#999999" width={iconSize} height={iconSize} />,
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={["#8CC63F", "#46983C", "#006837"]}
                start={{ x: 0.06, y: 0.06 }}
                end={{ x: 0.92, y: 0.9 }}
                style={{ borderRadius: moderateScale(100), padding: moderateScale(10) }}
              >
                <EventsIcon color="#ffffff" width={iconSize} height={iconSize} />
              </LinearGradient>
            : <EventsIcon color="#999999" width={iconSize} height={iconSize} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={["#8CC63F", "#46983C", "#006837"]}
                start={{ x: 0.06, y: 0.06 }}
                end={{ x: 0.92, y: 0.9 }}
                style={{ borderRadius: moderateScale(100), padding: moderateScale(10) }}
              >
                <FavoritesIcon color="#ffffff" width={iconSize} height={iconSize} />
              </LinearGradient>
            : <FavoritesIcon color="#999999" width={iconSize} height={iconSize} />,
        }}
      />
      <Tab.Screen
        name="JoinedEvents"
        component={JoinedEvents}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={["#8CC63F", "#46983C", "#006837"]}
                start={{ x: 0.06, y: 0.06 }}
                end={{ x: 0.92, y: 0.9 }}
                style={{ borderRadius: moderateScale(100), padding: moderateScale(10) }}
              >
                <JoinedEventsIcon color="#ffffff" width={iconSize} height={iconSize} />
              </LinearGradient>
            : <JoinedEventsIcon color="#999999" width={iconSize} height={iconSize} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={["#8CC63F", "#46983C", "#006837"]}
                start={{ x: 0.06, y: 0.06 }}
                end={{ x: 0.92, y: 0.9 }}
                style={{ borderRadius: moderateScale(100), padding: moderateScale(10) }}
              >
                <ProfileIcon color="#ffffff" width={iconSize} height={iconSize} />
              </LinearGradient>
            : <ProfileIcon color="#999999" width={iconSize} height={iconSize} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="SubmitContentRequest" component={SubmitContentRequest} />
      <Stack.Screen name="ContentRequests" component={ContentRequests} />
      <Stack.Screen name="EditAccount" component={EditAccount} />
      <Stack.Screen name="AddEventForm" component={AddEventForm} />
      <Stack.Screen name="AddGreenSpaceForm" component={AddGreenSpaceForm} />
      <Stack.Screen name="UpdateGreenSpaceForm" component={UpdateGreenSpaceForm} />
      <Stack.Screen name="GreenSpaceDetails" component={GreenSpaceDetails} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="GreenSpaceMap" component={GreenSpaceMap} />
    </Stack.Navigator>
  );
};
