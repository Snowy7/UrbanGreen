import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "@/navigation/types";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import TextInputComp from "@/components/TextInputComp";
import ButtonComp from "@/components/ButtonComp";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon } from "@/assets/icons";
import useRTLStyles from "./styles";
import useIsRTL from "@/hooks/useIsRTL";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useGreenSpaces } from "@/hooks/useGreenSpaces";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import CustomPicker from "@/components/CustomPicker";
import { Id } from "convex/_generated/dataModel";

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, "UpdateGreenspace">;
type RouteProps = RouteProp<AdminStackParamList, "UpdateGreenspace">;

const WEEK_DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const GREENSPACE_TYPES = [
  { label: "Park", value: "Park" },
  { label: "Garden", value: "Garden" },
  { label: "Playground", value: "Playground" },
  { label: "Nature Reserve", value: "Nature Reserve" },
  { label: "Community Garden", value: "Community Garden" },
];

const UpdateGreenspaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const { greenSpaces, updateGreenSpace } = useGreenSpaces();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
    type: "",
  });

  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const processWorkingTime = (workingTime: string) => {
    // workingTime 08:00 AM - 11:00 PM
    const parts = workingTime.split(" - ");

    const parseTime = (timePart: string): Date | null => {
      const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
      const match = timeRegex.exec(timePart);

      if (!match) return null;

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();

      if (ampm === "PM" && hours !== 12) {
        hours += 12;
      } else if (ampm === "AM" && hours === 12) {
        hours = 0;
      }

      const today = new Date();
      today.setHours(hours, minutes, 0, 0);
      return today;
    };

    const openTime = parseTime(parts[0]);
    const closeTime = parseTime(parts[1]);

    return { openTime: openTime || new Date(), closeTime: closeTime || new Date() };
  };

  useEffect(() => {
    const loadGreenspaceData = async () => {
      try {
        const greenspace = greenSpaces?.find((space) => space._id === route.params.id);
        if (greenspace) {
          const { workingTime, ...rest } = greenspace;
          const { openTime, closeTime } = processWorkingTime(workingTime);
          setFormData({
            name: greenspace.name,
            entryPrice: greenspace.entryPrice.toString(),
            plantInfo: greenspace.plantInfo || "",
            workingTime: greenspace.workingTime,
            workingDays: greenspace.workingDays.split(","),
            description: greenspace.description,
            location: greenspace.location,
            facilities: greenspace.facilities,
            images: greenspace.images.map((url) => ({
              uri: url,
              mimeType: url.endsWith(".png") ? "image/png" : "image/jpeg",
            })),
            openTime: openTime,
            closeTime: closeTime,
            type: greenspace.type,
          });
        }
      } catch (error) {
        console.error("Error loading greenspace data:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadGreenspaceData();
  }, [route.params.id, greenSpaces]);

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
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...result.assets],
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleWorkingDaysChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays:
        prev.workingDays.includes(value) ?
          prev.workingDays.filter((day) => day !== value)
        : [...prev.workingDays, value],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

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

      console.log(formData.openTime, formData.closeTime);

      const { closeTime, openTime, ...rest } = formData;

      await updateGreenSpace({
        id: route.params.id as Id<"greenSpaces">,
        ...rest,
        entryPrice: Number(formData.entryPrice),
        workingDays: formData.workingDays.join(","),
        images: imageUrls,
        workingTime: `${formatTime(formData.openTime)} - ${formatTime(formData.closeTime)}`,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error updating greenspace:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <TextComp text="LOADING" style={styles.emptyText} />
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
            <TextComp text="UPDATE_GREENSPACE" style={styles.heroText} />
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
                  style={[
                    styles.inputContainer,
                    { height: verticalScale(40), justifyContent: "center" },
                  ]}
                  onPress={() => setShowOpenTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={commonColors.secondary}
                      style={styles.timeIcon}
                    />
                    <TextComp
                      text={formatTime(formData.openTime)}
                      style={[styles.input, { lineHeight: verticalScale(24) }]}
                    />
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
                  style={[
                    styles.inputContainer,
                    { height: verticalScale(40), justifyContent: "center" },
                  ]}
                  onPress={() => setShowCloseTimePicker(true)}
                >
                  <View style={styles.timeInputContainer}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={commonColors.secondary}
                      style={styles.timeIcon}
                    />
                    <TextComp
                      text={formatTime(formData.closeTime)}
                      style={[styles.input, { lineHeight: verticalScale(24) }]}
                    />
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
              <CustomPicker
                value={formData.workingDays}
                onValueChange={(value) =>
                  setFormData({ ...formData, workingDays: value as string[] })
                }
                items={WEEK_DAYS.map((day) => ({
                  label: t(day),
                  value: day,
                  color:
                    formData.workingDays.includes(day) ?
                      commonColors.primary
                    : commonColors.gray500,
                }))}
                placeholder="SELECT_WORKING_DAYS"
                containerStyle={styles.inputContainer}
                multiple
              />
              <View style={styles.selectedDaysContainer}>
                {formData.workingDays.map((day) => (
                  <View key={day} style={styles.selectedDayTag}>
                    <TextComp text={t(day)} style={styles.selectedDayText} />
                    <TouchableOpacity
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          workingDays: prev.workingDays.filter((d) => d !== day),
                        }))
                      }
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
                  <Ionicons name="add-circle-outline" size={24} color={commonColors.secondary} />
                  <TextComp text="UPLOAD_IMAGES" style={styles.imageUploadText} />
                </TouchableOpacity>
              </View>
            </View>

            <ButtonComp
              title="UPDATE_GREENSPACE"
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

export default UpdateGreenspaceScreen;
