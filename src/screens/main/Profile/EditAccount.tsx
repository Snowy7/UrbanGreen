import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import TextInputComp from "@/components/TextInputComp";
import ButtonComp from "@/components/ButtonComp";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon } from "@/assets/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import { useUserProfile } from "@/hooks/useUserProfile";
import PhoneInput from "react-native-phone-number-input";
import useIsRTL from "@/hooks/useIsRTL";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "EditAccount">;

const EditAccount = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const { userProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    imageUrl: userProfile?.imageUrl || "",
  });

  const getCountryCodeAndNumber = (phoneNumber: string) => {
    if (!phoneNumber) return { countryCode: "SA", number: "" };
    
    // Remove the + if it exists
    const cleanNumber = phoneNumber.startsWith("+") ? phoneNumber.substring(1) : phoneNumber;
    
    // Common country codes
    const countryCodes = {
      "974": "QA", // Qatar
      "966": "SA", // Saudi Arabia
      "971": "AE", // UAE
      "973": "BH", // Bahrain
      "968": "OM", // Oman
      "965": "KW", // Kuwait
    };

    // Try to find a matching country code
    for (const [code, country] of Object.entries(countryCodes)) {
      if (cleanNumber.startsWith(code)) {
        return {
          countryCode: country,
          number: cleanNumber.substring(code.length),
        };
      }
    }

    // Default to Saudi Arabia if no match found
    return { countryCode: "SA", number: cleanNumber };
  };

  const updateUser = useMutation(api.users.updateUser);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateUser({
        id: userProfile._id,
        ...formData,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const { countryCode, number } = getCountryCodeAndNumber(userProfile?.phone || "");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={["#8CC63F", "#46983C", "#006837"]}
            start={{ x: 0.06, y: 0.06 }}
            end={{ x: 0.92, y: 0.9 }}
            style={styles.heroGradient}
          />
          <View style={styles.heroTextContainer}>
            <TextComp text="Edit Account Information" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: formData.imageUrl || "https://via.placeholder.com/150" }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.horizontalInputs}>
            <View style={styles.horizontalInputsContainer}>
              <TextComp text="First Name" style={styles.inputLabel} />
              <TextInputComp
                value={formData.firstName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, firstName: text }))}
                placeholder="Enter first name"
                style={styles.input}
                containerStyle={styles.inputContainerHorizontal}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.horizontalInputsContainer}>
              <TextComp text="Last Name" style={styles.inputLabel} />
              <TextInputComp
                value={formData.lastName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, lastName: text }))}
                placeholder="Enter last name"
                style={styles.input}
                containerStyle={styles.inputContainerHorizontal}
                placeholderTextColor={commonColors.gray200}
              />
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <TextComp text="Email" style={styles.inputLabel} />
            <TextInputComp
              value={formData.email}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
              placeholder="Enter email"
              keyboardType="email-address"
              style={styles.input}
              containerStyle={styles.inputContainer}
              placeholderTextColor={commonColors.gray200}
            />
          </View>

          <View style={styles.inputsContainer}>
            <TextComp text="Phone" style={styles.inputLabel} />
            <PhoneInput
              ref={phoneInput}
              layout="second"
              defaultCode={countryCode as any}
              defaultValue={number}
              containerStyle={styles.inputContainer}
              textContainerStyle={styles.input}
              textInputStyle={styles.input}
              onChangeFormattedText={(text) => {
                setFormData((prev) => ({ ...prev, phone: text }));
              }}
            />
          </View>

          <ButtonComp
            title="Save Changes"
            onPress={handleSubmit}
            isLoading={loading}
            style={styles.submitButton}
          />
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.white,
  },
  content: {
    flex: 1,
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: verticalScale(40),
  },
  heroText: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
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
  imageContainer: {
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(10),
  },
  changeImageText: {
    color: commonColors.primary,
    textDecorationLine: "underline",
  },
  horizontalInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: verticalScale(16),
    gap: moderateScale(10),
  },
  horizontalInputsContainer: {
    flex: 1,
  },
  inputsContainer: {
    marginBottom: verticalScale(16),
    width: "100%",
  },
  inputLabel: {
    fontSize: moderateScale(14),
    color: commonColors.primary,
    marginBottom: verticalScale(4),
  },
  input: {
    width: "100%",
    color: "#000",
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: moderateScale(4),
    fontSize: moderateScale(14),
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: commonColors.gray200,
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    fontSize: moderateScale(14),
  },
  inputContainerHorizontal: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: commonColors.gray200,
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    fontSize: moderateScale(14),
    width: "100%",
  },
  submitButton: {
    marginTop: verticalScale(24),
    height: verticalScale(40),
    width: "50%",
    alignSelf: "center",
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

export default EditAccount;
