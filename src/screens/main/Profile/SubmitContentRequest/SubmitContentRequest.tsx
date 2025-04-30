import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon } from "@/assets/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import { Picker } from "@react-native-picker/picker";
import ButtonComp from "@/components/ButtonComp";
import { Image } from "react-native";
import CustomPicker from "@/components/CustomPicker";
type NavigationProp = NativeStackNavigationProp<MainStackParamList, "SubmitContentRequest">;

const REQUEST_TYPES = ["Add Event", "Add Green Space", "Update Green Space"];

const SubmitContentRequest = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const [selectedType, setSelectedType] = useState("");

  const handleRequestTypeSelect = () => {
    switch (selectedType) {
      case "Add Event":
        navigation.navigate("AddEventForm");
        break;
      case "Add Green Space":
        navigation.navigate("AddGreenSpaceForm");
        break;
      case "Update Green Space":
        navigation.navigate("UpdateGreenSpaceForm");
        break;
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

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
          <View style={styles.heroImageContainer}>
            <Image source={require("@/assets/images/ContentRequest.png")} style={styles.heroImage} />
          </View>
          <View style={styles.heroTextContainer}>
            <TextComp text="Submit Content Request" style={styles.heroText} />
            <TextComp
              text="Please select the type of content request you would like to submit from the options below."
              style={styles.heroSubText}
            />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.inputContainer}>
            <TextComp text="Select Request Type" style={styles.label} />
            <View style={styles.pickerContainer}>
              <CustomPicker
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as string)}
                items={[
                  { label: "Select a request type", value: "" },
                  ...REQUEST_TYPES.map(type => ({ label: type, value: type }))
                ]}
                placeholder="SELECT_REQUEST_TYPE"
                containerStyle={styles.picker}
              />
            </View>
          </View>

          <ButtonComp
            title="Continue"
            onPress={handleRequestTypeSelect}
            disabled={!selectedType}
            style={styles.continueButton}
          />
        </View>
      </View>

      <TouchableOpacity onPress={handleClose} style={styles.backArrow}>
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
    height: "50%",
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
    paddingBottom: verticalScale(60),
    paddingHorizontal: moderateScale(20),
  },
  heroImageContainer: {
    height: "80%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "40%",
    height: "40%",
    resizeMode: "contain",
    // center the image
    alignSelf: "center",
    // vertical center the image
    marginTop: verticalScale(20),
  },
  heroText: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: commonColors.white,
  },
  heroSubText: {
    fontSize: moderateScale(16),
    color: commonColors.white,
  },
  backArrow: {
    position: "absolute",
    top: verticalScale(40),
    left: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: "#ffffff55",
    borderRadius: moderateScale(100),
  },
  whiteBoard: {
    flex: 1,
    backgroundColor: commonColors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: -moderateScale(20),
    padding: moderateScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    marginBottom: verticalScale(8),
    color: commonColors.secondary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: commonColors.gray200,
    borderRadius: moderateScale(10),
    overflow: "hidden",
  },
  picker: {
    height: verticalScale(50),
    color: commonColors.secondary,
  },
  continueButton: {
    marginTop: verticalScale(20),
  },
});

export default SubmitContentRequest;
