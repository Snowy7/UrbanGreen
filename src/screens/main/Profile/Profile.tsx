//import libraries
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors, commonColors } from '@/styles/colors';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import HeaderComp from '@/components/HeaderComp';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Profile'>;

const Profile = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { userProfile } = useUserProfile();
  const { signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderButton = (title: string, onPress: () => void, icon: string) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Ionicons name={icon as any} size={24} color={commonColors.primary} style={styles.buttonIcon} />
        <TextComp text={title} style={[styles.buttonText, { color: colors.text }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#8CC63F', '#46983C', '#006837']}
            start={{ x: 0.06, y: 0.06 }}
            end={{ x: 0.92, y: 0.9 }}
            style={styles.heroGradient}
          />
          <View style={styles.heroTextContainer}>
            <TextComp text="Profile" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: userProfile?.imageUrl || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            <TextComp
              text={`${userProfile?.firstName} ${userProfile?.lastName}`}
              style={styles.profileName}
            />
          </View>

          {renderButton('Edit Account Information', () => navigation.navigate('EditAccount'), 'person-outline')}
          
          {!userProfile?.isAdmin && (
            <>
              {renderButton('Submit Content Request', () => navigation.navigate('SubmitContentRequest'), 'add-circle-outline')}
              {renderButton('Content Requests', () => navigation.navigate('ContentRequests'), 'list-outline')}
            </>
          )}
          
          {renderButton('Logout', () => setLogoutModalVisible(true), 'log-out-outline')}
        </View>
      </View>

      <DeleteConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        buttonText="LOGOUT"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    height: verticalScale(150),
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: commonColors.white,
  },
  whiteBoard: {
    flex: 1,
    backgroundColor: commonColors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: -moderateScale(20),
    padding: moderateScale(20),
    gap: verticalScale(15),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(10),
  },
  profileName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: commonColors.secondary,
  },
  button: {
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    shadowColor: commonColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: moderateScale(10),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
});

export default Profile;
