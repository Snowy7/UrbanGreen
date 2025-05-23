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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: colors.text,
    },
    heroSection: {
      height: verticalScale(150),
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
      paddingHorizontal: moderateScale(20),
      paddingTop: moderateScale(20),
      paddingBottom: 0,
    },
    
    listContainer: {
      paddingBottom: verticalScale(100),
      backgroundColor: colors.background,
    },

    listFooter: {
      height: verticalScale(50),
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    emptyText: {
      color: colors.text,
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
      width: "100%",
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
    addEventButton: {
      // center horizontally, 80 from bottom
      position: "absolute",
      bottom: verticalScale(80),
      alignSelf: "center",
      backgroundColor: commonColors.primary,
      padding: moderateScale(10),
      borderRadius: moderateScale(100),
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(10),
      shadowColor: commonColors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    addEventText: {
      fontSize: moderateScale(16),
      fontWeight: "medium",
      color: commonColors.white,
    },
    fillerView: {
      height: verticalScale(500),
      backgroundColor: "red",
    },
    // Form validation styles
    inputError: {
      borderColor: commonColors.error,
    },
    errorText: {
      color: commonColors.error,
      fontSize: moderateScale(12),
      marginTop: verticalScale(4),
    },
  });
};

export default useRTLStyles;
