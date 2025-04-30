import { StyleSheet } from "react-native";
import { Colors, commonColors } from "@/styles/colors";
import { moderateScale, verticalScale } from "@/styles/scaling";

const useRTLStyles = (isRTL: boolean, theme: "light" | "dark") => {
  const colors = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    heroSection: {
      height: verticalScale(200),
      position: "relative",
    },
    heroGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    heroTextContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    heroText: {
      color: commonColors.white,
      fontSize: moderateScale(24),
      fontWeight: "bold",
    },
    whiteBoard: {
      flex: 1,
      backgroundColor: commonColors.white,
      borderTopLeftRadius: moderateScale(20),
      borderTopRightRadius: moderateScale(20),
      marginTop: -moderateScale(20),
      padding: moderateScale(20),
    },
    formContainer: {
      flex: 1,
    },
    inputsContainer: {
      marginBottom: verticalScale(16),
    },
    horizontalInputsContainer: {
      flexDirection: "row",
      marginBottom: verticalScale(16),
    },
    inputLabel: {
      fontSize: moderateScale(14),
      color: colors.text,
      marginBottom: verticalScale(8),
    },
    inputContainer: {
      backgroundColor: colors.background,
      borderRadius: moderateScale(8),
      padding: moderateScale(12),
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    input: {
      fontSize: moderateScale(14),
      color: colors.text,
      width: '100%',
    },
    pickerContainer: {
      padding: 0,
    },
    picker: {
      height: verticalScale(40),
    },
    descriptionContainer: {
      height: verticalScale(120),
    },
    descriptionInput: {
      height: "100%",
    },
    submitButton: {
      marginTop: verticalScale(24),
      marginBottom: verticalScale(40),
    },
    backArrow: {
        position: "absolute",
        top: verticalScale(40),
        left: moderateScale(15),
        padding: moderateScale(10),
        backgroundColor: "#ffffff55",
        borderRadius: moderateScale(100),
      },
  });
};

export default useRTLStyles; 