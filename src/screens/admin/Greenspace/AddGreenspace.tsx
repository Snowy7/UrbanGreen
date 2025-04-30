import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "@/navigation/types";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import WrapperContainer from "@/components/WrapperContainer";
import HeaderComp from "@/components/HeaderComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import TextInputComp from "@/components/TextInputComp";
import ButtonComp from "@/components/ButtonComp";
import { useGreenSpaces } from "@/hooks/useGreenSpaces";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon } from "@/assets/icons";
import useRTLStyles from "./styles";
import useIsRTL from "@/hooks/useIsRTL";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, "AddGreenspace">;

const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const AddGreenspaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const { createGreenSpace } = useGreenSpaces();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const generateUploadUrl = useMutation(api.greenspaces.generateUploadUrl);

  const [formData, setFormData] = useState({
    name: "",
    entryPrice: "",
    plantInfo: "",
    workingTime: "",
    workingDays: [] as string[],
    description: "",
    location: "",
    facilities: "",
    images: [] as ImagePicker.ImagePickerAsset[],
    openTime: new Date(),
    closeTime: new Date(),
  });

  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...result.assets]
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleWorkingDaysChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(value)
        ? prev.workingDays.filter(day => day !== value)
        : [...prev.workingDays, value]
    }));
  };

  const uploadImages = async () => {
    const imageUrls = [];
    for (const image of formData.images) {
      const uploadUrl = await generateUploadUrl();
      console.log("uploadUrl", uploadUrl);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const result = await fetch(uploadUrl, {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": image.mimeType || "image/jpeg",
        },
      });

      console.log("result", result);

      const { storageId } = await result.json();
      imageUrls.push(storageId);
      console.log("imageUrls", imageUrls);
    }
    return imageUrls;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrls = await uploadImages();
      await createGreenSpace({
        ...formData,
        entryPrice: Number(formData.entryPrice),
        workingDays: formData.workingDays.join(","),
        images: imageUrls,
        workingTime: `${formatTime(formData.openTime)} - ${formatTime(formData.closeTime)}`,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error creating greenspace:", error);
    } finally {
      setLoading(false);
    }
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
          <View style={styles.heroTextContainer}>
            <TextComp text="Add New Green Space" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <ScrollView style={styles.formContainer}>
            <View style={styles.inputsContainer}>
              <TextComp text="GREEN_SPACE_NAME" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_GREEN_SPACE_NAME"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="ENTRY_PRICE" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_ENTRY_PRICE"
                value={formData.entryPrice}
                onChangeText={(text) => setFormData({ ...formData, entryPrice: text })}
                keyboardType="numeric"
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="PLANT_INFO" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_PLANT_INFO"
                value={formData.plantInfo}
                onChangeText={(text) => setFormData({ ...formData, plantInfo: text })}
                multiline
                numberOfLines={4}
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.horizontalInputsContainer}>
              <View style={[styles.inputsContainer, { flex: 1, marginRight: moderateScale(8) }]}>
                <TextComp text="OPEN_TIME" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { height: verticalScale(40), justifyContent: 'center' }]}
                  onPress={() => setShowOpenTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons name="time-outline" size={20} color={commonColors.secondary} style={styles.timeIcon} />
                    <TextComp text={formatTime(formData.openTime)} style={[styles.input, { lineHeight: verticalScale(24) }]} />
                  </View>
                </TouchableOpacity>
                {showOpenTimePicker && (
                  <DateTimePicker
                    value={formData.openTime}
                    mode="time"
                    style={{ backgroundColor: colors.background }}
                    onChange={(event, time) => {
                      setShowOpenTimePicker(false);
                      if (time) setFormData({ ...formData, openTime: time });
                    }}
                  />
                )}
              </View>

              <View style={[styles.inputsContainer, { flex: 1, marginLeft: moderateScale(8) }]}>
                <TextComp text="CLOSE_TIME" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { height: verticalScale(40), justifyContent: 'center' }]}
                  onPress={() => setShowCloseTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons name="time-outline" size={20} color={commonColors.secondary} style={styles.timeIcon} />
                    <TextComp text={formatTime(formData.closeTime)} style={[styles.input, { lineHeight: verticalScale(24) }]} />
                  </View>
                </TouchableOpacity>
                {showCloseTimePicker && (
                  <DateTimePicker
                    value={formData.closeTime}
                    mode="time"
                    style={{ backgroundColor: colors.background }}
                    onChange={(event, time) => {
                      setShowCloseTimePicker(false);
                      if (time) setFormData({ ...formData, closeTime: time });
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="SELECT_WORKING_DAYS" style={styles.inputLabel} />
              <View style={[styles.inputContainer, styles.pickerContainer]}>
                <Picker
                  selectedValue=""
                  onValueChange={handleWorkingDaysChange}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label={t("SELECT_WORKING_DAYS")} value="" />
                  {WEEK_DAYS.map((day) => (
                    <Picker.Item 
                      key={day} 
                      label={t(day)} 
                      value={day}
                      color={formData.workingDays.includes(day) ? commonColors.primary : commonColors.gray500}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.selectedDaysContainer}>
                {formData.workingDays.map((day) => (
                  <View key={day} style={styles.selectedDayTag}>
                    <TextComp text={day} style={styles.selectedDayText} />
                    <TouchableOpacity
                      onPress={() => handleWorkingDaysChange(day)}
                      style={styles.removeDayButton}
                    >
                      <Ionicons name="close-circle" size={16} color={commonColors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="DESCRIPTION" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_DESCRIPTION"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={8}
                style={[styles.input, styles.descriptionInput]}
                containerStyle={{ ...styles.inputContainer, ...styles.descriptionContainer }}
                placeholderTextColor={commonColors.gray200}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="LOCATION" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_LOCATION"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="FACILITIES" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_FACILITIES"
                value={formData.facilities}
                onChangeText={(text) => setFormData({ ...formData, facilities: text })}
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="IMAGES" style={styles.inputLabel} />
              <View style={styles.imagesContainer}>
                {formData.images.map((asset, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: asset.uri }} style={styles.thumbnail} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color={commonColors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity 
                  style={[styles.inputContainer, styles.imageUploadButton]}
                  onPress={pickImage}
                >
                  <Ionicons name="add" size={24} color={commonColors.secondary} />
                  <TextComp text="UPLOAD_IMAGES" style={styles.imageUploadText} />
                </TouchableOpacity>
              </View>
            </View>

            <ButtonComp
              title="CREATE_GREENSPACE"
              onPress={handleSubmit}
              isLoading={loading}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backArrow}
      >
        <BackArrowIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
  },
  submitButton: {
    marginTop: verticalScale(24),
  },
  workingDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  dayButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(4),
    borderWidth: 1,
    borderColor: commonColors.gray300,
    backgroundColor: commonColors.white,
  },
  selectedDayButton: {
    backgroundColor: commonColors.primary,
    borderColor: commonColors.primary,
  },
  dayButtonText: {
    fontSize: moderateScale(12),
    color: commonColors.gray500,
  },
  selectedDayButtonText: {
    color: commonColors.white,
  },
  pickerContainer: {
    padding: 0,
  },
  picker: {
    height: moderateScale(40),
  },
  selectedDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
    marginTop: verticalScale(8),
  },
  selectedDayTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColors.primary,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(4),
    gap: moderateScale(4),
  },
  selectedDayText: {
    color: commonColors.white,
    fontSize: moderateScale(12),
  },
  removeDayButton: {
    padding: moderateScale(2),
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: moderateScale(8),
  },
});

export default AddGreenspaceScreen;
