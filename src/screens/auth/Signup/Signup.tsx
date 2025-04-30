import { BackArrowIcon, EyeIcon } from "@/assets/icons";
import ButtonComp from "@/components/ButtonComp";
import TextComp from "@/components/TextComp";
import TextInputComp from "@/components/TextInputComp";
import WrapperContainer from "@/components/WrapperContainer";
import { AuthStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import useRTLStyles from "./styles";
import useIsRTL from "@/hooks/useIsRTL";
import { useTheme } from "@/context/ThemeContext";
import HeaderComp from "@/components/HeaderComp";
import { LinearGradient } from "expo-linear-gradient";
import { commonColors } from "@/styles/colors";
import { useSignUp } from "@clerk/clerk-expo";
import { OTPVerificationProps } from "../OTPVerification/OTPVerification";
import LoadingOverlay from "@/components/LoadingOverlay";
import PhoneInput from "react-native-phone-number-input";
import { Image } from "react-native";
import { moderateScale, verticalScale } from "@/styles/scaling";

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const Signup = () => {
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);

  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);

  const { isLoaded, signUp, setActive } = useSignUp();

  const handleSignup = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);

    try {
      console.log("signup", firstName, lastName, email, phone, password);
      const resource =await signUp.create({
        emailAddress: email,
        password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
      });

      // skip verification for now and activate user
      await setActive({ session: resource.createdSessionId });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <LinearGradient
        colors={[commonColors.primary, commonColors.secondary, "#006837"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.welcomeContainer}>
              <TextComp text="CREATE_ACCOUNT" style={styles.welcomeText} />
              <TextComp text="SIGN_UP_TO_GET_STARTED" style={styles.subtitleText} />
            </View>
            <View style={styles.whiteBoard}>
              <View style={styles.horizontalInputs}>
                <View style={styles.horizontalInputsContainer}>
                  <TextComp text="FIRST_NAME" style={styles.inputLabel} />
                  <TextInputComp
                    placeholder="ENTER_FIRST_NAME"
                    value={firstName}
                    onChangeText={setFirstName}
                    style={styles.input}
                    containerStyle={styles.inputContainer}
                    placeholderTextColor={commonColors.gray200}
                  />
                </View>

                <View style={styles.horizontalInputsContainer}>
                  <TextComp text="LAST_NAME" style={styles.inputLabel} />
                  <TextInputComp
                    placeholder="ENTER_LAST_NAME"
                    value={lastName}
                    onChangeText={setLastName}
                    style={styles.input}
                    containerStyle={styles.inputContainer}
                    placeholderTextColor={commonColors.gray200}
                  />
                </View>
              </View>

              <View style={styles.inputsContainer}>
                <TextComp text="EMAIL" style={styles.inputLabel} />
                <TextInputComp
                  placeholder="ENTER_EMAIL"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  style={styles.input}
                  containerStyle={styles.inputContainer}
                  placeholderTextColor={commonColors.gray200}
                />
              </View>

              <View style={styles.inputsContainer}>
                <TextComp text="PHONE" style={styles.inputLabel} />
                <PhoneInput
                  ref={phoneInput}
                  layout="second"
                  defaultCode="SA"
                  containerStyle={styles.inputContainer}
                  textContainerStyle={styles.input}
                  textInputStyle={styles.input}
                  onChangeFormattedText={(text) => {
                    setPhone(text);
                  }}
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

              <ButtonComp
                title="CREATE_ACCOUNT"
                onPress={handleSignup}
                disabled={loading}
                style={styles.signupButton}
              />

              <TouchableOpacity onPress={handleBackToLogin} style={styles.createAccountContainer}>
                <TextComp text="HAVE_ACCOUNT_BACK_TO_LOGIN" style={styles.createAccountText} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* back arrow */}
      <TouchableOpacity onPress={() => navigation.navigate("Onboard")} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
