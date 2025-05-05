import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ViewStyle } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "@/navigation/types";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import TextInputComp from "@/components/TextInputComp";
import ButtonComp from "@/components/ButtonComp";
import CustomPicker from "@/components/CustomPicker";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon, CalendarIcon, ClockIcon } from "@/assets/icons";
import useRTLStyles from "./styles";
import useIsRTL from "@/hooks/useIsRTL";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGreenSpaces } from "@/hooks/useGreenSpaces";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, "UpdateEvent">;

const EVENT_CATEGORIES = [
  { label: "ENVIRONMENTAL_VOLUNTEER_ACTIVITY", value: "ENVIRONMENTAL_VOLUNTEER_ACTIVITY" },
  { label: "ENVIRONMENTAL_AWARENESS_EVENT", value: "ENVIRONMENTAL_AWARENESS_EVENT" },
  { label: "SOCIAL_EVENT", value: "SOCIAL_EVENT" },
  { label: "SPORT_ACTIVITY", value: "SPORT_ACTIVITY" }
];

interface FormState {
  name: string;
  category: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  description: string;
  location: string;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  location?: string;
  time?: string;
}

const UpdateEventScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<AdminStackParamList, "UpdateEvent">>();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const { greenSpaces } = useGreenSpaces();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const eventId = route.params.id;
  
  // Fetch event data
  const event = useQuery(api.events.getById, { id: eventId as Id<"events"> });
  
  // Update mutation
  const updateEvent = useMutation(api.events.update);

  const [formData, setFormData] = useState<FormState>({
    name: "",
    category: EVENT_CATEGORIES[0].value,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    description: "",
    location: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (event) {
      try {
        // Convert string dates to Date objects
        const dateObj = new Date(event.date);
        
        // Parse time strings (assuming format like "10:30 AM")
        const parseTimeString = (timeStr: string) => {
          return new Date(timeStr);
        };
        

        setFormData({
          name: event.name,
          category: event.category,
          date: dateObj,
          startTime: parseTimeString(event.startTime),
          endTime: parseTimeString(event.endTime),
          description: event.description,
          location: event.location,
        });
        
        setInitialLoading(false);
      } catch (error) {
        console.error("Error parsing event data:", error);
        setInitialLoading(false);
      }
    }
  }, [event]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "EVENT_NAME_REQUIRED";
    }
    
    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "EVENT_DESCRIPTION_REQUIRED";
    }
    
    // Validate location
    if (!formData.location) {
      newErrors.location = "EVENT_LOCATION_REQUIRED";
    }
    
    // Validate that end time is after start time
    if (formData.endTime <= formData.startTime) {
      newErrors.time = "END_TIME_MUST_BE_AFTER_START_TIME";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors in the form before submitting.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Format dates for API
      const formattedDate = formData.date.toISOString().split('T')[0];
      
      await updateEvent({
        id: eventId as Id<"events">,
        name: formData.name,
        category: formData.category,
        date: formattedDate,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        description: formData.description,
        location: formData.location,
      });
      
      Alert.alert(
        "Success",
        "Event updated successfully",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Failed to update event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <TextComp text="LOADING" style={styles.loadingText} />
        </View>
      </View>
    );
  }

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
            <TextComp text="UPDATE_EVENT" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <ScrollView 
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: verticalScale(100) }}
          >
            <View style={styles.inputsContainer}>
              <TextComp text="EVENT_NAME" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_EVENT_NAME"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                style={styles.input}
                containerStyle={
                  errors.name 
                    ? { ...styles.inputContainer, ...styles.inputError } 
                    : styles.inputContainer
                }
                placeholderTextColor={commonColors.gray200}
              />
              {errors.name && (
                <TextComp 
                  text={errors.name} 
                  style={styles.errorText} 
                />
              )}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="EVENT_CATEGORY" style={styles.inputLabel} />
              <CustomPicker
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as string })}
                items={EVENT_CATEGORIES}
                placeholder="SELECT_CATEGORY"
                containerStyle={styles.inputContainer}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="EVENT_DATE" style={styles.inputLabel} />
              <TouchableOpacity
                style={{
                  ...styles.inputContainer,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: moderateScale(10)
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <CalendarIcon
                  color={commonColors.primary}
                  width={moderateScale(20)}
                  height={moderateScale(20)}
                />
                <TextComp text={formatDate(formData.date)} style={styles.input} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  style={{ backgroundColor: colors.background }}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setFormData({ ...formData, date });
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.horizontalInputsContainer}>
              <View style={[styles.inputsContainer, { flex: 1, marginRight: moderateScale(8) }]}>
                <TextComp text="START_TIME" style={styles.inputLabel} />
                <TouchableOpacity
                  style={{
                    ...styles.inputContainer,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: moderateScale(10),
                    ...(errors.time ? styles.inputError : {})
                  }}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <ClockIcon
                    color={commonColors.primary}
                    width={moderateScale(20)}
                    height={moderateScale(20)}
                  />
                  <TextComp text={formatTime(formData.startTime)} style={styles.input} />
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
                        if (errors.time) {
                          setErrors({ ...errors, time: undefined });
                        }
                      }
                    }}
                  />
                )}
              </View>

              <View style={[styles.inputsContainer, { flex: 1, marginLeft: moderateScale(8) }]}>
                <TextComp text="END_TIME" style={styles.inputLabel} />
                <TouchableOpacity
                  style={{
                    ...styles.inputContainer,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: moderateScale(10),
                    ...(errors.time ? styles.inputError : {})
                  }}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <ClockIcon
                    color={commonColors.primary}
                    width={moderateScale(20)}
                    height={moderateScale(20)}
                  />
                  <TextComp text={formatTime(formData.endTime)} style={styles.input} />
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
                        if (errors.time) {
                          setErrors({ ...errors, time: undefined });
                        }
                      }
                    }}
                  />
                )}
              </View>
            </View>
            
            {errors.time && (
              <TextComp 
                text={errors.time} 
                style={{ ...styles.errorText, marginTop: -verticalScale(12), marginBottom: verticalScale(12) }} 
              />
            )}

            <View style={styles.inputsContainer}>
              <TextComp text="DESCRIPTION" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_EVENT_DESCRIPTION"
                value={formData.description}
                onChangeText={(text) => {
                  setFormData({ ...formData, description: text });
                  if (errors.description) {
                    setErrors({ ...errors, description: undefined });
                  }
                }}
                multiline
                numberOfLines={8}
                style={[styles.input, styles.descriptionInput]}
                containerStyle={
                  errors.description
                    ? { ...styles.inputContainer, ...styles.descriptionContainer, ...styles.inputError }
                    : { ...styles.inputContainer, ...styles.descriptionContainer }
                }
                placeholderTextColor={commonColors.gray200}
                textAlignVertical="top"
              />
              {errors.description && (
                <TextComp 
                  text={errors.description} 
                  style={styles.errorText} 
                />
              )}
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="LOCATION" style={styles.inputLabel} />
              <CustomPicker
                value={formData.location}
                onValueChange={(value) => {
                  setFormData({ ...formData, location: value as string });
                  if (errors.location) {
                    setErrors({ ...errors, location: undefined });
                  }
                }}
                items={greenSpaces?.map(space => ({
                  label: space.name,
                  value: space._id
                })) || []}
                placeholder="Select Location"
                containerStyle={
                  errors.location
                    ? { ...styles.inputContainer, ...styles.inputError }
                    : styles.inputContainer
                }
                disabled={!greenSpaces?.length}
              />
              {errors.location && (
                <TextComp 
                  text={errors.location} 
                  style={styles.errorText} 
                />
              )}
            </View>

            <ButtonComp
              title="Update Event"
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

export default UpdateEventScreen;
