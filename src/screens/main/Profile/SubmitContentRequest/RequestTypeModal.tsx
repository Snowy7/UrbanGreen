import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import ButtonComp from "@/components/ButtonComp";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon } from "@/assets/icons";
import { Picker } from "@react-native-picker/picker";

type RequestType = "Add Event" | "Add Green Space" | "Update Green Space";

interface RequestTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: (type: RequestType) => void;
}

const RequestTypeModal = ({ visible, onClose, onContinue }: RequestTypeModalProps) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const [selectedType, setSelectedType] = useState<RequestType>("Add Event");

  const handleContinue = () => {
    onContinue(selectedType);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
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
              <TextComp text="Submit Content Request" style={styles.heroText} />
            </View>
          </View>

          <View style={styles.whiteBoard}>
            <TextComp text="Select Request Type" style={styles.sectionTitle} />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(value) => setSelectedType(value as RequestType)}
                style={styles.picker}
              >
                <Picker.Item label="Add Event" value="Add Event" />
                <Picker.Item label="Add Green Space" value="Add Green Space" />
                <Picker.Item label="Update Green Space" value="Update Green Space" />
              </Picker>
            </View>

            <ButtonComp title="Continue" onPress={handleContinue} style={styles.continueButton} />
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    flex: 1,
    marginTop: verticalScale(50),
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
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: commonColors.secondary,
    marginBottom: verticalScale(10),
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: commonColors.gray200,
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(20),
  },
  picker: {
    height: verticalScale(50),
  },
  continueButton: {
    marginTop: verticalScale(20),
  },
  backArrow: {
    position: "absolute",
    top: verticalScale(40),
    left: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: "#ffffffa0",
    borderRadius: moderateScale(100),
  },
});

export default RequestTypeModal;
