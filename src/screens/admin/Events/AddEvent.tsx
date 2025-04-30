import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
import useRTLStyles from "./AddEvent/styles";
import useIsRTL from "@/hooks/useIsRTL";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGreenSpaces } from "@/hooks/useGreenSpaces";

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, "AddEvent">;

const EVENT_CATEGORIES = [
  { label: "Environmental Volunteer Activity", value: "Environmental Volunteer Activity" },
  { label: "Educational Workshop", value: "Educational Workshop" },
  { label: "Community Gathering", value: "Community Gathering" },
  { label: "Nature Walk", value: "Nature Walk" },
  { label: "Gardening Workshop", value: "Gardening Workshop" },
];

const AddEventScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const { greenSpaces } = useGreenSpaces();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: EVENT_CATEGORIES[0].value,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    description: "",
    location: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // TODO: Implement event creation
      navigation.goBack();
    } catch (error) {
      console.error("Error creating event:", error);
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
            <TextComp text="ADD_NEW_EVENT" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <ScrollView style={styles.formContainer}>
            <View style={styles.inputsContainer}>
              <TextComp text="EVENT_NAME" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_EVENT_NAME"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={commonColors.gray200}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Event Category" style={styles.inputLabel} />
              <CustomPicker
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                items={EVENT_CATEGORIES}
                placeholder="SELECT_CATEGORY"
                containerStyle={styles.inputContainer}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="EVENT_DATE" style={styles.inputLabel} />
              <TouchableOpacity
                style={[styles.inputContainer, { flexDirection: "row", alignItems: "center", gap: moderateScale(10) }]}
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
                />
              )}
            </View>

            <View style={styles.horizontalInputsContainer}>
              <View style={[styles.inputsContainer, { flex: 1, marginRight: moderateScale(8) }]}>
                <TextComp text="START_TIME" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { flexDirection: "row", alignItems: "center", gap: moderateScale(10) }]}
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
                      if (time) setFormData({ ...formData, startTime: time });
                    }}
                  />
                )}
              </View>

              <View style={[styles.inputsContainer, { flex: 1, marginLeft: moderateScale(8) }]}>
                <TextComp text="END_TIME" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { flexDirection: "row", alignItems: "center", gap: moderateScale(10) }]}
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
                      if (time) setFormData({ ...formData, endTime: time });
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="DESCRIPTION" style={styles.inputLabel} />
              <TextInputComp
                placeholder="ENTER_EVENT_DESCRIPTION"
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
              <CustomPicker
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
                items={greenSpaces?.map(space => ({
                  label: space.name,
                  value: space._id
                })) || []}
                placeholder="Select Location"
                containerStyle={styles.inputContainer}
                disabled={!greenSpaces?.length}
              />
            </View>

            <ButtonComp
              title="CREATE_EVENT"
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

export default AddEventScreen;
