import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import ButtonComp from "@/components/ButtonComp";
import HeaderComp from "@/components/HeaderComp";
import TextComp from "@/components/TextComp";
import WrapperContainer from "@/components/WrapperContainer";
import { useTheme } from "@/context/ThemeContext";
import useIsRTL from "@/hooks/useIsRTL";
import { AuthStackParamList } from "@/navigation/types";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import useRTLStyles from "./styles";
import { changeFirstTimeState } from "@/redux/actions/auth";
import { useSignUp } from "@clerk/clerk-expo";
import { commonColors } from "@/styles/colors";
import { BackArrowIcon } from "@/assets/icons";
import { Image } from "react-native";
import LoadingOverlay from "@/components/LoadingOverlay";
export interface OTPVerificationProps {
  route: {
    params: {
      email: string;
      phone: string;
      type: "email" | "phone";
      firstName: string;
      lastName: string;
    };
  };
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ route }) => {
  const { email, phone, type, firstName, lastName } = route.params;
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { isLoaded, signUp, setActive } = useSignUp();

  const handleContinue = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        changeFirstTimeState(true);
        // TODO: Navigate to main app
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    Keyboard.dismiss
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[commonColors.primary, commonColors.secondary, "#006837"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={styles.background}
      />
      <LoadingOverlay visible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.welcomeContainer}>
              <TextComp text="VERIFY_ACCOUNT" style={styles.welcomeText} />
              <TextComp text="ENTER_OTP_SENT_TO" values={{ email }} style={styles.subtitleText} />
            </View>

            <View style={styles.whiteBoard}>
              <View style={styles.OTPImageContainer}>
                <Image
                  source={require("@/assets/images/OTP.png")}
                  style={styles.OTPImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.otpSection}>
                <OTPInputView
                  style={styles.otpInput}
                  pinCount={6}
                  code={otp}
                  onCodeChanged={(code) => setOtp(code)}
                  autoFocusOnLoad
                  codeInputFieldStyle={styles.otpField}
                  codeInputHighlightStyle={styles.otpFieldFocused}
                  keyboardAppearance={theme === "dark" ? "dark" : "light"}
                />
              </View>

              <ButtonComp
                title="VERIFY"
                onPress={handleContinue}
                style={styles.verifyButton}
                disabled={otp.length !== 6}
              />

              <TouchableOpacity onPress={handleResendOTP} style={styles.resendContainer}>
                <TextComp text="RESEND_OTP" style={styles.resendText} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* back arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerification;
