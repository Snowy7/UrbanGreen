import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onLayout?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onLayout }) => {
  return (
    <View style={styles.container} onLayout={onLayout}>
      <LinearGradient
        colors={['#8CC63F', '#46983C', '#006837']}
        start={{ x: 0.06, y: 0.06 }}
        end={{ x: 0.92, y: 0.9 }}
        style={styles.gradient}
      />
      <Image
        source={require('@/assets/images/onboard-welcome.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  image: {
    width: width * 0.5, // 50% of screen width
    height: height * 0.25, // 25% of screen height
  },
});

export default SplashScreen; 