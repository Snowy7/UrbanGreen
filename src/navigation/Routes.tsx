import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import AuthStack from "./AuthStack";
import { MainStack } from "./MainStack";
import { AdminStack } from "./AdminStack";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ActivityIndicator, StatusBar } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import { useAuth } from "@clerk/clerk-expo";
import { useUserProfile } from "@/hooks/useUserProfile";
import WrapperContainer from "@/components/WrapperContainer";
const Stack = createNativeStackNavigator<RootStackParamList>();

export const Routes = () => {
  const { isFirstTime } = useSelector((state: RootState) => state.auth);
  const { isSignedIn } = useAuth();
  const { theme } = useTheme();
  const colors = Colors[theme ?? "light"];
  const { userProfile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <WrapperContainer style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={commonColors.primary} />
      </WrapperContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle={colors.statusBar} backgroundColor="transparent" translucent />
      <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
        {isSignedIn ?
          userProfile?.isAdmin ?
            <Stack.Screen name="Admin" component={AdminStack} />
          : <Stack.Screen name="Main" component={MainStack} />
        : <Stack.Screen name="Auth" component={AuthStack} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
