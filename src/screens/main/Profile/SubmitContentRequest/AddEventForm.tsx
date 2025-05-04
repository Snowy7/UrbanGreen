import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
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
import { useGreenSpaces } from "@/hooks/useGreenSpaces";
import useIsRTL from "@/hooks/useIsRTL";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import CustomPicker from "@/components/CustomPicker";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "AddEventForm">;

const EVENT_CATEGORIES = [
  "ENVIRONMENTAL_VOLUNTEER_ACTIVITY",
  "ENVIRONMENTAL_AWARENESS_EVENT",
  "SOCIAL_EVENT",
  "SPORT_ACTIVITY"
];

const AddEventForm = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const createContentRequest = useMutation(api.contentRequests.create);
  const { greenSpaces } = useGreenSpaces();
  const [loading, setLoading] = useState(false);

  // Initialize time slots at 00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [formData, setFormData] = useState({
    name: "",
    category: EVENT_CATEGORIES[0],
    date: today,
    startTime: today,
    endTime: today,
    description: "",
    location: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors = {
      name: "",
      category: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
    };

    let isValid = true;

    // Check for empty or whitespace-only strings
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Event name is required";
      isValid = false;
    }

    if (!formData.category || formData.category.trim() === "") {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
      isValid = false;
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
      isValid = false;
    }

    if (formData.startTime >= formData.endTime && formData.endTime.getHours() !== 0) {
      newErrors.endTime = "End time must be after start time";
      isValid = false;
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.location || formData.location.trim() === "") {
      newErrors.location = "Location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields correctly.");
      return;
    }

    try {
      setLoading(true);
      const description = JSON.stringify({
        name: formData.name.trim(),
        category: formData.category.trim(),
        date: formData.date.toISOString(),
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        eventDescription: formData.description.trim(),
        eventLocation: formData.location.trim(),
      });

      await createContentRequest({
        type: "Add Event",
        title: `Add event request: ${formData.name.trim()}`,
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
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
            <TextComp text="Add Event Request" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <ScrollView style={styles.formContainer}>
            <View style={styles.inputsContainer}>
              <TextComp text="Event Name" style={styles.inputLabel} />
              <TextInputComp
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  setErrors({ ...errors, name: "" });
                }}
                placeholder="Enter event name"
                style={[styles.input, errors.name ? styles.inputError : null]}
              />
              {errors.name ? <TextComp text={errors.name} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Category" style={styles.inputLabel} />
              <CustomPicker
                value={formData.category}
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value as string });
                  setErrors({ ...errors, category: "" });
                }}
                items={EVENT_CATEGORIES.map(category => ({
                  label: t(category),
                  value: category
                }))}
                placeholder="SELECT_CATEGORY"
                containerStyle={[styles.inputContainer, errors.category ? styles.inputError : null]}
              />
              {errors.category ? <TextComp text={errors.category} style={styles.errorText} /> : null}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Date" style={styles.inputLabel} />
              <TouchableOpacity
                style={[styles.inputContainer, errors.date ? styles.inputError : null]}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.timeInputContainer}>
                  <Ionicons name="calendar-outline" size={20} color={colors.buttonSecondary} style={styles.timeIcon} />
                <TextComp text={formatDate(formData.date)} style={styles.input} />
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  style={{ backgroundColor: colors.background }}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setFormData({ ...formData, date });
                      setErrors({ ...errors, date: "" });
                    }
                  }}
                />
              )}
              {errors.date ? <TextComp text={errors.date} style={styles.errorText} /> : null}
            </View>

            <View style={styles.horizontalInputsContainer}>
              <View style={[styles.inputsContainer, { flex: 1, marginRight: moderateScale(8) }]}>
                <TextComp text="Start Time" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, errors.startTime ? styles.inputError : null]}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons name="time-outline" size={20} color={colors.buttonSecondary} style={styles.timeIcon} />
                  <TextComp text={formatTime(formData.startTime)} style={styles.input} />
                  </View>
                </TouchableOpacity>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={formData.startTime}
                    mode="time"
                    style={{ backgroundColor: colors.background }}
                    onChange={(event, time) => {
                      setShowStartTimePicker(false);
                      if (time) {
                        setFormData({ ...formData, startTime: time });
                        setErrors({ ...errors, startTime: "" });
                      }
                    }}
                  />
                )}
                {errors.startTime ? <TextComp text={errors.startTime} style={styles.errorText} /> : null}
              </View>

              <View style={[styles.inputsContainer, { flex: 1, marginLeft: moderateScale(8) }]}>
                <TextComp text="End Time" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, errors.endTime ? styles.inputError : null]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons name="time-outline" size={20} color={colors.buttonSecondary} style={styles.timeIcon} />
                  <TextComp text={formatTime(formData.endTime)} style={styles.input} />
                  </View>
                </TouchableOpacity>
                {showEndTimePicker && (
                  <DateTimePicker
                    value={formData.endTime}
                    mode="time"
                    style={{ backgroundColor: colors.background }}
                    onChange={(event, time) => {
                      setShowEndTimePicker(false);
                      if (time) {
                        setFormData({ ...formData, endTime: time });
                        setErrors({ ...errors, endTime: "" });
                      }
                    }}
                  />
                )}
                {errors.endTime ? <TextComp text={errors.endTime} style={styles.errorText} /> : null}
              </View>
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Description" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_EVENT_DESCRIPTION"
                value={formData.description}
                onChangeText={(text) => {
                  setFormData({ ...formData, description: text });
                  setErrors({ ...errors, description: "" });
                }}
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
              <CustomPicker
                value={formData.location}
                onValueChange={(value) => {
                  setFormData({ ...formData, location: value as string });
                  setErrors({ ...errors, location: "" });
                }}
                items={[
                  { label: "Select a location", value: "" },
                  ...(greenSpaces?.map(space => ({
                    label: space.name,
                    value: space._id
                  })) || [])
                ]}
                placeholder="SELECT_LOCATION"
                containerStyle={[styles.inputContainer, errors.location ? styles.inputError : null]}
              />
              {errors.location ? <TextComp text={errors.location} style={styles.errorText} /> : null}
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
      fontSize: moderateScale(24),
      fontWeight: "bold",
    },
    whiteBoard: {
      flex: 1,
      backgroundColor: commonColors.white,
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
    backArrow: {
      position: "absolute",
      top: verticalScale(40),
      left: moderateScale(15),
      padding: moderateScale(10),
      backgroundColor: "#ffffff55",
      borderRadius: moderateScale(100),
    },
    timeInputContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeIcon: {
      marginRight: moderateScale(8),
    },
  });
};

export default AddEventForm;
