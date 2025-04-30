//import liraries
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSignIn } from "@clerk/clerk-expo";

import ButtonComp from "@/components/ButtonComp";
import HeaderComp from "@/components/HeaderComp";
import TextComp from "@/components/TextComp";
import TextInputComp from "@/components/TextInputComp";
import WrapperContainer from "@/components/WrapperContainer";
import useIsRTL from "@/hooks/useIsRTL";
import { AuthStackParamList } from "@/navigation/types";

import { useTheme } from "@/context/ThemeContext";
import useRTLStyles from "./styles";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { commonColors } from "@/styles/colors";
import { BackArrowIcon } from "@/assets/icons";
import LoadingOverlay from "@/components/LoadingOverlay";

const Login = () => {
  const { theme } = useTheme();
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        console.error("Sign in not complete:", result);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("Signup");
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password navigation
    console.log("Forgot password pressed");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LoadingOverlay visible={loading} />
      <LinearGradient
        colors={[commonColors.primary, commonColors.secondary, "#006837"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.background}
      />

      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <TextComp text="WELCOME_BACK" style={styles.welcomeText} />

          <TextComp text="SIGN_IN_TO_CONTINUE" style={styles.subtitleText} />
        </View>
        <View style={styles.whiteBoard}>
          <ScrollView
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {error && (
              <View style={styles.errorContainer}>
                <TextComp text={error} style={styles.errorText} />
              </View>
            )}

            <View style={styles.inputsContainer}>
              <TextComp text="EMAIL" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_EMAIL"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="PASSWORD" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_PASSWORD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <TextComp text="FORGOT_PASSWORD" style={styles.forgotPasswordText} />
            </TouchableOpacity>

            <ButtonComp
              title="LOGIN"
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            />
          </ScrollView>
          <TouchableOpacity onPress={handleCreateAccount} style={styles.createAccountContainer}>
            <TextComp text="NO_ACCOUNT_CREATE_NEW" style={styles.createAccountText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* back arrow */}
      <TouchableOpacity onPress={() => navigation.navigate("Onboard")} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;
