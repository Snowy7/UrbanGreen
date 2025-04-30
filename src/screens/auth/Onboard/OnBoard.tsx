//import libraries
import React from 'react';
import { View, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import TextComp from '@/components/TextComp';
import ButtonComp from '@/components/ButtonComp';
import useRTLStyles from './styles';
import { Colors } from '@/styles/colors';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthStackParamList } from '@/navigation/types';
import { LanguageIcon } from '@/assets/icons';
import { changeLanguageState } from '@/redux/actions/settings';

const { width, height } = Dimensions.get('window');

type OnboardScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboard'>;

const Onboard = () => {
  const { theme } = useTheme();
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const navigation = useNavigation<OnboardScreenNavigationProp>();

  const handleCreateAccount = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Welcome Image */}
      <Image
        source={require('@/assets/images/onboard-welcome.png')}
        style={styles.welcomeImage}
        resizeMode="contain"
      />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#8CC63F', '#46983C', '#006837']}
        start={{ x: 0.06, y: 0.06 }}
        end={{ x: 0.92, y: 0.90 }}
        style={styles.gradientBackground}
      />

      {/* Content Container */}
      <View style={styles.contentContainer}>
        <TextComp
          text="WELCOME_TO_URBANGREEN"
          style={styles.title}
          isDynamic={false}
        />

        <TextComp
          text="ONBOARD_DESCRIPTION"
          style={styles.description}
          isDynamic={false}
        />

        {/* Buttons Container */}
        <View style={styles.buttonContainer}>
          <ButtonComp
            title="CREATE_AN_ACCOUNT"
            onPress={handleCreateAccount}
            variant="secondary"
            style={styles.createAccountButton}
            textStyle={styles.createAccountText}
          />

          <ButtonComp
            title="LOGIN"
            onPress={handleLogin}
            variant="primary"
            style={styles.loginButton}
            textStyle={styles.loginText}
          />
        </View>
      </View>

      {/* Language Selector */}
      <Pressable style={styles.languageContainer} onPress={() => changeLanguageState(isRTL ? { name: 'English', sortName: 'en' } : { name: 'Arabic', sortName: 'ar' })}>
        <LanguageIcon />
        <TextComp
          text={isRTL ? 'AR' : 'EN'}
          style={styles.languageText}
          isDynamic={true}
        />
      </Pressable>
    </View>
  );
};

export default Onboard;
