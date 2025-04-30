import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon } from "@/assets/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import TextInputComp from "@/components/TextInputComp";
import ButtonComp from "@/components/ButtonComp";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import useIsRTL from "@/hooks/useIsRTL";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "AddGreenSpaceForm">;

const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const AddGreenSpaceForm = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const createContentRequest = useMutation(api.contentRequests.create);
  const generateUploadUrl = useMutation(api.greenspaces.generateUploadUrl);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);

  // Initialize time slots at 00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
    openTime: today,
    closeTime: today,
  });

  const [errors, setErrors] = useState({
    name: "",
    entryPrice: "",
    plantInfo: "",
    openTime: "",
    closeTime: "",
    workingDays: "",
    description: "",
    location: "",
    facilities: "",
    images: "",
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

  const validateForm = () => {
    const newErrors = {
      name: "",
      entryPrice: "",
      plantInfo: "",
      openTime: "",
      closeTime: "",
      workingDays: "",
      description: "",
      location: "",
      facilities: "",
      images: "",
    };

    let isValid = true;

    // Check for empty or whitespace-only strings
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Green space name is required";
      isValid = false;
    }

    if (!formData.entryPrice || !formData.entryPrice.trim()) {
      newErrors.entryPrice = "Entry price is required";
      isValid = false;
    } else if (isNaN(Number(formData.entryPrice)) || Number(formData.entryPrice) < 0) {
      newErrors.entryPrice = "Entry price must be a valid number";
      isValid = false;
    }

    if (!formData.plantInfo || !formData.plantInfo.trim()) {
      newErrors.plantInfo = "Plant information is required";
      isValid = false;
    }

    if (!formData.openTime) {
      newErrors.openTime = "Open time is required";
      isValid = false;
    }

    if (!formData.closeTime) {
      newErrors.closeTime = "Close time is required";
      isValid = false;
    }

    if (formData.openTime >= formData.closeTime) {
      newErrors.closeTime = "Close time must be after open time";
      isValid = false;
    }

    if (formData.workingDays.length === 0) {
      newErrors.workingDays = "At least one working day is required";
      isValid = false;
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.location || !formData.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    if (!formData.facilities || !formData.facilities.trim()) {
      newErrors.facilities = "Facilities are required";
      isValid = false;
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
        setErrors(prev => ({ ...prev, images: "" }));
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
    setErrors(prev => ({ ...prev, workingDays: "" }));
  };

  const uploadImages = async () => {
    const imageUrls = [];
    for (const image of formData.images) {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const result = await fetch(uploadUrl, {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": image.mimeType || "image/jpeg",
        },
      });

      const { storageId } = await result.json();
      imageUrls.push(storageId);
    }
    return imageUrls;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields correctly.");
      return;
    }

    try {
      setLoading(true);
      const imageUrls = await uploadImages();
      const description = JSON.stringify({
        name: formData.name.trim(),
        entryPrice: Number(formData.entryPrice),
        plantInfo: formData.plantInfo.trim(),
        workingTime: `${formatTime(formData.openTime)} - ${formatTime(formData.closeTime)}`,
        workingDays: formData.workingDays.join(","),
        description: formData.description.trim(),
        location: formData.location.trim(),
        facilities: formData.facilities.trim(),
        images: imageUrls,
      });

      await createContentRequest({
        type: "Add Green Space",
        title: `Add green space request: ${formData.name.trim()}`,
        description,
        status: "pending",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting content request:", error);
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
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
          <View style={styles.heroTextContainer}>
            <TextComp text="Add Green Space Request" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <ScrollView style={styles.formContainer}>
            <View style={styles.inputsContainer}>
              <TextComp text="Green Space Name" style={styles.inputLabel} />
              <TextInputComp
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  setErrors({ ...errors, name: "" });
                }}
                placeholder="Enter green space name"
                style={[styles.input, errors.name ? styles.inputError : null]}
              />
              {errors.name ? <TextComp text={errors.name} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Entry Price" style={styles.inputLabel} />
              <TextInputComp
                value={formData.entryPrice}
                onChangeText={(text) => {
                  setFormData({ ...formData, entryPrice: text });
                  setErrors({ ...errors, entryPrice: "" });
                }}
                placeholder="Enter entry price"
                keyboardType="numeric"
                style={[styles.input, errors.entryPrice ? styles.inputError : null]}
              />
              {errors.entryPrice ? <TextComp text={errors.entryPrice} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Plant Information" style={styles.inputLabel} />
              <TextInputComp
                value={formData.plantInfo}
                onChangeText={(text) => {
                  setFormData({ ...formData, plantInfo: text });
                  setErrors({ ...errors, plantInfo: "" });
                }}
                placeholder="Enter plant information"
                multiline
                numberOfLines={8}
                style={[styles.input, styles.descriptionInput, errors.plantInfo ? styles.inputError : null]}
                containerStyle={{ ...styles.inputContainer, ...styles.descriptionContainer }}
                placeholderTextColor={commonColors.gray200}
                textAlignVertical="top"
              />
              {errors.plantInfo ? <TextComp text={errors.plantInfo} style={styles.errorText} /> : null}
            </View>

            <View style={styles.horizontalInputsContainer}>
              <View style={[styles.inputsContainer, { flex: 1, marginRight: moderateScale(8) }]}>
                <TextComp text="Open Time" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { height: verticalScale(40), justifyContent: 'center' }, errors.openTime ? styles.inputError : null]}
                  onPress={() => setShowOpenTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons name="time-outline" size={20} color={colors.buttonSecondary} style={styles.timeIcon} />
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
                      if (time) {
                        setFormData({ ...formData, openTime: time });
                        setErrors({ ...errors, openTime: "" });
                      }
                    }}
                  />
                )}
                {errors.openTime ? <TextComp text={errors.openTime} style={styles.errorText} /> : null}
              </View>

              <View style={[styles.inputsContainer, { flex: 1, marginLeft: moderateScale(8) }]}>
                <TextComp text="Close Time" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { height: verticalScale(40), justifyContent: 'center' }, errors.closeTime ? styles.inputError : null]}
                  onPress={() => setShowCloseTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons name="time-outline" size={20} color={colors.buttonSecondary} style={styles.timeIcon} />
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
                      if (time) {
                        setFormData({ ...formData, closeTime: time });
                        setErrors({ ...errors, closeTime: "" });
                      }
                    }}
                  />
                )}
                {errors.closeTime ? <TextComp text={errors.closeTime} style={styles.errorText} /> : null}
              </View>
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Working Days" style={styles.inputLabel} />
              <View style={[styles.pickerContainer, errors.workingDays ? styles.inputError : null]}>
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
                      color={formData.workingDays.includes(day) ? commonColors.primary : colors.buttonSecondary}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.selectedDaysContainer}>
                {formData.workingDays.map((day) => (
                  <View key={day} style={styles.selectedDayTag}>
                    <TextComp text={t(day)} style={styles.selectedDayText} />
                    <TouchableOpacity
                      onPress={() => handleWorkingDaysChange(day)}
                      style={styles.removeDayButton}
                    >
                      <Ionicons name="close-circle" size={16} color={commonColors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {errors.workingDays ? <TextComp text={errors.workingDays} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Description" style={styles.inputLabel} />
              <TextInputComp
                value={formData.description}
                onChangeText={(text) => {
                  setFormData({ ...formData, description: text });
                  setErrors({ ...errors, description: "" });
                }}
                placeholder="Enter description"
                multiline
                numberOfLines={8}
                style={[styles.input, styles.descriptionInput, errors.description ? styles.inputError : null]}
                containerStyle={{ ...styles.inputContainer, ...styles.descriptionContainer }}
                placeholderTextColor={commonColors.gray200}
                textAlignVertical="top"
              />
              {errors.description ? <TextComp text={errors.description} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Location" style={styles.inputLabel} />
              <TextInputComp
                value={formData.location}
                onChangeText={(text) => {
                  setFormData({ ...formData, location: text });
                  setErrors({ ...errors, location: "" });
                }}
                placeholder="Enter location"
                style={[styles.input, errors.location ? styles.inputError : null]}
              />
              {errors.location ? <TextComp text={errors.location} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Facilities" style={styles.inputLabel} />
              <TextInputComp
                value={formData.facilities}
                onChangeText={(text) => {
                  setFormData({ ...formData, facilities: text });
                  setErrors({ ...errors, facilities: "" });
                }}
                placeholder="Enter facilities"
                style={[styles.input, errors.facilities ? styles.inputError : null]}
              />
              {errors.facilities ? <TextComp text={errors.facilities} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Images" style={styles.inputLabel} />
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
                  style={[styles.inputContainer, styles.imageUploadButton, errors.images ? styles.inputError : null]}
                  onPress={pickImage}
                >
                  <Ionicons name="add" size={24} color={colors.buttonSecondary} />
                  <TextComp text="Upload Images" style={styles.imageUploadText} />
                </TouchableOpacity>
              </View>
              {errors.images ? <TextComp text={errors.images} style={styles.errorText} /> : null}
            </View>

            <ButtonComp
              title="Submit Request"
              onPress={handleSubmit}
              isLoading={loading}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity onPress={handleClose} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>
    </View>
  );
};

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
      marginTop: verticalScale(25),
      fontSize: moderateScale(24),
      fontWeight: "bold",
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
      backgroundColor: colors.background,
      borderTopLeftRadius: moderateScale(20),
      borderTopRightRadius: moderateScale(20),
      marginTop: -moderateScale(20),
      padding: moderateScale(20),
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
      color: colors.buttonSecondary,
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
    inputError: {
      borderColor: commonColors.error,
    },
    errorText: {
      color: commonColors.error,
      fontSize: moderateScale(12),
      marginTop: verticalScale(4),
    },
    pickerContainer: {
      padding: 0,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: moderateScale(8),
    },
    picker: {
      height: verticalScale(40),
    },
    timeInputContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeIcon: {
      marginRight: moderateScale(8),
    },
    selectedDaysContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateScale(8),
      marginTop: verticalScale(8),
    },
    selectedDayTag: {
      flexDirection: "row",
      alignItems: "center",
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
    imagesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateScale(8),
    },
    imageWrapper: {
      position: "relative",
      width: moderateScale(100),
      height: moderateScale(100),
    },
    thumbnail: {
      width: "100%",
      height: "100%",
      borderRadius: moderateScale(8),
    },
    removeImageButton: {
      position: "absolute",
      top: -moderateScale(8),
      right: -moderateScale(8),
      backgroundColor: commonColors.white,
      borderRadius: moderateScale(12),
    },
    imageUploadButton: {
      width: moderateScale(100),
      height: moderateScale(100),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: moderateScale(8),
      borderStyle: "dashed",
    },
    imageUploadText: {
      color: colors.buttonSecondary,
      fontSize: moderateScale(12),
      marginTop: moderateScale(4),
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
  });
};

export default AddGreenSpaceForm; 