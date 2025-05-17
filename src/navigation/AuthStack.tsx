import { Login, Signup, OTPVerification } from "@/screens";
import React from "react";
import { AuthStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboard from "@/screens/auth/Onboard/OnBoard";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
      id={undefined}
    >
      <Stack.Screen name="Onboard" component={Onboard} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      {/* <Stack.Screen name="OTPVerification" component={OTPVerification} />  */}
    </Stack.Navigator>
  );
};

export default AuthStack;
