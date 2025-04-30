import {
  EventsIcon,
  FavoritesIcon,
  GreenspaceIcon,
  HomeIcon,
  JoinedEventsIcon,
  NotificationIcon,
  PendingRequestsIcon,
  ProfileIcon,
} from "@/assets/icons";
import {
  AdminGreenspace,
  AdminHome,
  AdminRequestDetails,
  EditAccount,
  EventDetails,
  GreenSpaceDetails,
  Home,
  Profile,
} from "@/screens";
import { Colors } from "@/styles/colors";
import fontFamily from "@/styles/fontFamily";
import { moderateScale } from "@/styles/scaling";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";
import MyTabBar from "./MyTabBar";
import { AdminStackParamList, MainStackParamList } from "./types";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddGreenspaceScreen from "@/screens/admin/Greenspace/AddGreenspace";
import UpdateGreenspaceScreen from "@/screens/admin/Greenspace/UpdateGreenspace";
import EventsScreen from "@/screens/admin/Events/Events";
import AddEventScreen from "@/screens/admin/Events/AddEvent";
import UpdateEventScreen from "@/screens/admin/Events/UpdateEvent";
import PendingRequests from "@/screens/admin/PendingRequests/PendingRequests";

const Tab = createBottomTabNavigator<AdminStackParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

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
      id={undefined}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={AdminHome}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={["#006837", "#3B903A", "#8CC63F", "#8CC63F"]}
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
        name="Greenspace"
        component={AdminGreenspace}
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
        component={EventsScreen}
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
        name="PendingRequests"
        component={PendingRequests}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ?
              <LinearGradient
                colors={["#8CC63F", "#46983C", "#006837"]}
                start={{ x: 0.06, y: 0.06 }}
                end={{ x: 0.92, y: 0.9 }}
                style={{ borderRadius: moderateScale(100), padding: moderateScale(10) }}
              >
                <PendingRequestsIcon color="#ffffff" width={iconSize} height={iconSize} />
              </LinearGradient>
            : <PendingRequestsIcon color="#999999" width={iconSize} height={iconSize} />,
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

export const AdminStack = () => {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="AddGreenspace"
        component={AddGreenspaceScreen}
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UpdateGreenspace"
        component={UpdateGreenspaceScreen}
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UpdateEvent"
        component={UpdateEventScreen}
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestDetails"
        component={AdminRequestDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="GreenspaceDetails"
        component={GreenSpaceDetails}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
