import { StyleSheet } from 'react-native';
import { Colors, ThemeType, commonColors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { useMemo } from 'react';

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
  const colors = Colors[theme];
  
  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      height: '100%',
    },
    whiteBoard: {
      width: '100%',
      height: '50%',
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
    welcomeContainer: {
      marginBottom: verticalScale(20),
      paddingHorizontal: moderateScale(20),
    },
    welcomeText: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(24),
      color: commonColors.white,
      marginBottom: verticalScale(4),
      textAlign: 'left',
    },
    subtitleText: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(14),
      color: commonColors.white,
      marginBottom: verticalScale(24),
      textAlign: 'left',
    },
    inputsContainer: {
      marginBottom: verticalScale(16),
      width: '100%',
    },
    inputLabel: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(14),
      color: commonColors.primary,
      marginBottom: verticalScale(4),
      textAlign: 'left',
    },
    input: {
      width: '100%',
      color: "#000",
      backgroundColor: 'transparent',
      paddingVertical: 0,
      paddingHorizontal: moderateScale(4),
    },
    inputContainer: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: commonColors.gray200,
      borderRadius: moderateScale(6),
      padding: moderateScale(12),
      fontSize: moderateScale(14),
    },
    forgotPasswordContainer: {
      alignSelf: 'flex-end',
      marginBottom: verticalScale(20),
    },
    forgotPasswordText: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(12),
      color: commonColors.primary,
    },
    loginButton: {
      backgroundColor: commonColors.primary,
      borderRadius: moderateScale(8),
      paddingVertical: verticalScale(10),
      marginBottom: verticalScale(20),
    },
    createAccountContainer: {
      alignItems: 'center',
    },
    createAccountText: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(12),
      color: commonColors.primary,
    },
    backArrow: {
      position: 'absolute',
      top: verticalScale(30),
      left: moderateScale(15),
      padding: moderateScale(10),
      backgroundColor: "#ffffff55",
      borderRadius: moderateScale(100),
    },
    errorContainer: {
      marginBottom: verticalScale(16),
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(10),
      backgroundColor: commonColors.error + '50',
      borderRadius: moderateScale(6),
    },
    errorText: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScale(14),
      color: commonColors.error,
    },
  }), [isRTL, theme, colors]);
};

export default useRTLStyles;