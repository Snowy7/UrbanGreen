import { StyleSheet } from 'react-native';
import { Colors, commonColors, ThemeType } from '@/styles/colors';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import fontFamily from '@/styles/fontFamily';

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
  const colors = Colors[theme];

  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradientBackground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      borderTopLeftRadius: moderateScale(37),
      borderTopRightRadius: moderateScale(37),
      overflow: 'hidden',
    },
    welcomeImage: {
      width: '50%',
      height: '25%',
      resizeMode: 'contain',
      alignSelf: 'center',
      top: '12.5%',
    },
    contentContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      padding: moderateScale(30),
      paddingTop: verticalScale(30),
      paddingBottom: verticalScale(50),
      justifyContent: 'space-between',
    },
    title: {
      fontSize: moderateScale(28),
      color: commonColors.white,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: verticalScale(16),
      fontFamily: fontFamily.bold,
    },
    description: {
      fontSize: moderateScale(14),
      color: commonColors.white,
      textAlign: isRTL ? 'right' : 'left',
      lineHeight: moderateScale(20),
      marginBottom: verticalScale(32),
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: moderateScale(16),
      justifyContent: 'space-between',
    },
    loginButton: {
      flex: 1,
      color: '#fff',
      backgroundColor: '#8CC63F',
      borderRadius: moderateScale(8),
      borderWidth: 1,
      borderColor: '#8CC63F',
      shadowColor: '#353535',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    createAccountText: {
      color: '#46983C',
      fontSize: moderateScale(12),
      textAlign: 'center',
      fontFamily: fontFamily.medium,
    },
    createAccountButton: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: moderateScale(8),
      borderWidth: 1,
      borderColor: commonColors.white,
      shadowColor: '#353535',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    loginText: {
      color: '#fff',
      fontSize: moderateScale(12),
      textAlign: 'center',
      fontFamily: fontFamily.medium,
    },
    languageContainer: {
      position: 'absolute',
      top: verticalScale(40),
      right: moderateScale(20),
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
    },
    languageText: {
      color: '#2F883A',
      fontSize: moderateScale(12),
      textAlign: 'center',
      fontFamily: fontFamily.medium,
    },
  }), [isRTL, theme, colors]);
};

export default useRTLStyles;