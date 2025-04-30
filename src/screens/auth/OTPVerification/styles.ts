import { StyleSheet } from "react-native";
import { Colors, ThemeType, commonColors } from "@/styles/colors";
import fontFamily from "@/styles/fontFamily";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { useMemo } from "react";

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
  const colors = Colors[theme];

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        background: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        content: {
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-start",
          height: "100%",
        },
        welcomeContainer: {
          marginBottom: verticalScale(20),
          paddingHorizontal: moderateScale(20),
        },
        welcomeText: {
          fontFamily: fontFamily.bold,
          fontSize: moderateScale(24),
          color: colors.text,
          marginBottom: verticalScale(4),
          textAlign: "left",
        },
        subtitleText: {
          fontFamily: fontFamily.regular,
          fontSize: moderateScale(14),
          color: colors.text,
          marginBottom: verticalScale(24),
          textAlign: "left",
        },
        whiteBoard: {
          width: "100%",
          height: "50%",
          maxWidth: moderateScale(400),
          backgroundColor: commonColors.white,
          borderTopLeftRadius: moderateScale(25),
          borderTopRightRadius: moderateScale(25),
          padding: moderateScale(20),
          shadowColor: commonColors.black,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
        OTPImageContainer: {
          width: "100%",
          height: verticalScale(60),
          marginBottom: verticalScale(30),
        },
        OTPImage: {
          width: "100%",
          height: verticalScale(60),
          marginBottom: verticalScale(30),
        },
        otpSection: {
          marginBottom: verticalScale(32),
        },
        otpInput: {
          width: "100%",
          height: moderateScale(50),
        },
        otpField: {
          width: moderateScale(49),
          height: moderateScale(50),
          borderWidth: 1,
          borderColor: commonColors.gray200,
          borderRadius: moderateScale(10),
          color: commonColors.black,
          fontSize: moderateScale(24),
          fontFamily: fontFamily.medium,
          backgroundColor: commonColors.white,
        },
        otpFieldFocused: {
          borderColor: commonColors.primary,
          borderWidth: 1,
        },
        verifyButton: {
          backgroundColor: commonColors.primary,
          borderRadius: moderateScale(8),
          paddingVertical: verticalScale(10),
          marginBottom: verticalScale(20),
        },
        resendContainer: {
          alignItems: "center",
        },
        resendText: {
          fontFamily: fontFamily.regular,
          fontSize: moderateScale(12),
          color: commonColors.primary,
        },
        backArrow: {
          position: "absolute",
          top: verticalScale(30),
          left: moderateScale(15),
          padding: moderateScale(10),
          backgroundColor: "#ffffff55",
          borderRadius: moderateScale(100),
        },
      }),
    [isRTL, theme, colors]
  );
};

export default useRTLStyles;
