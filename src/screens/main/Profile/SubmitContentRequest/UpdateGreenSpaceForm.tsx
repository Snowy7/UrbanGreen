import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { BackArrowIcon } from "@/assets/icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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
import { useGreenSpaces } from "@/hooks/useGreenSpaces";
import useIsRTL from "@/hooks/useIsRTL";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'UpdateGreenSpaceForm'>;
type UpdateGreenSpaceFormParams = {
  greenSpaceId: string;
};

const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

interface FormData {
  name: string;
  entryPrice: string;
  plantInfo: string;
  openTime: Date;
  closeTime: Date;
  workingDays: string[];
  description: string;
  location: string;
  facilities: string;
  images: ImagePicker.ImagePickerAsset[];
  workingTime: string;
}

const UpdateGreenSpaceForm = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<MainStackParamList, "UpdateGreenSpaceForm">>();
  const createContentRequest = useMutation(api.contentRequests.create);
  const generateUploadUrl = useMutation(api.greenspaces.generateUploadUrl);
  const { greenSpaces } = useGreenSpaces();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { t } = useTranslation();
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);

  const [selectedGreenSpaceId, setSelectedGreenSpaceId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    entryPrice: "",
    plantInfo: "",
    openTime: new Date(),
    closeTime: new Date(),
    workingDays: [],
    description: "",
    location: "",
    facilities: "",
    images: [],
    workingTime: "",
  });

  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

  useEffect(() => {
    if (greenSpaces) {
      setInitialLoading(false);
    }
  }, [greenSpaces]);

  const loadGreenspaceData = async () => {
    try {
      if (!selectedGreenSpaceId) {
        console.error("No green space ID provided");
        return;
      }
      const greenSpace = greenSpaces.find(gs => gs._id === selectedGreenSpaceId);
      if (greenSpace) {
        const existingImages = greenSpace.images.map(url => ({
          uri: url,
          mimeType: url.endsWith(".png") ? "image/png" : "image/jpeg",
        })) as ImagePicker.ImagePickerAsset[];

        setFormData({
          name: greenSpace.name,
          entryPrice: greenSpace.entryPrice.toString(),
          plantInfo: greenSpace.plantInfo,
          openTime: new Date(`2000-01-01T${greenSpace.workingTime.split(" - ")[0]}`),
          closeTime: new Date(`2000-01-01T${greenSpace.workingTime.split(" - ")[1]}`),
          workingDays: greenSpace.workingDays.split(","),
          description: greenSpace.description,
          location: greenSpace.location,
          facilities: greenSpace.facilities,
          images: existingImages,
          workingTime: greenSpace.workingTime,
        });
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error loading green space data:", error);
    }
  };

  useEffect(() => {
    if (selectedGreenSpaceId) {
      loadGreenspaceData();
    }
  }, [selectedGreenSpaceId, greenSpaces]);

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
    try {
      if (!selectedGreenSpaceId) {
        console.error("No green space ID provided");
        return;
      }
      setLoading(true);
      const imageUrls = await uploadImages();
      
      const description = JSON.stringify({
        greenSpaceId: selectedGreenSpaceId,
        greenSpaceName: formData.name,
        entryPrice: Number(formData.entryPrice),
        plantInfo: formData.plantInfo,
        workingTime: `${formatTime(formData.openTime)} - ${formatTime(formData.closeTime)}`,
        workingDays: formData.workingDays.join(","),
        greenSpaceDescription: formData.description,
        greenSpaceLocation: formData.location,
        facilities: formData.facilities,
        images: imageUrls,
      });

      await createContentRequest({
        type: "Update Green Space",
        title: `Update request for ${formData.name}`,
        description,
        status: "pending",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting content request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <TextComp text="Loading..." style={styles.loadingText} />
      </View>
    );
  }

  if (!showForm) {
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
              <TextComp text="Select Green Space to Update" style={styles.heroText} />
            </View>
          </View>

          <View style={styles.whiteBoard}>
            <View style={styles.inputsContainer}>
              <TextComp text="Select Green Space" style={styles.inputLabel} />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedGreenSpaceId}
                  onValueChange={(value) => setSelectedGreenSpaceId(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a green space" value="" />
                  {greenSpaces?.map((space) => (
                    <Picker.Item 
                      key={space._id} 
                      label={space.name} 
                      value={space._id}
                      color={colors.text}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <ButtonComp
              title="Continue"
              onPress={() => selectedGreenSpaceId && loadGreenspaceData()}
              disabled={!selectedGreenSpaceId}
              style={styles.submitButton}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleClose} style={styles.backArrow}>
          <BackArrowIcon />
        </TouchableOpacity>
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
            <TextComp text="Update Green Space Request" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <ScrollView style={styles.formContainer}>
            <View style={styles.inputsContainer}>
              <TextComp text="Green Space Name" style={styles.inputLabel} />
              <TextInputComp
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter green space name"
                style={styles.input}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Entry Price" style={styles.inputLabel} />
              <TextInputComp
                value={formData.entryPrice}
                onChangeText={(text) => setFormData({ ...formData, entryPrice: text })}
                placeholder="Enter entry price"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Plant Information" style={styles.inputLabel} />
              <TextInputComp
                value={formData.plantInfo}
                onChangeText={(text) => setFormData({ ...formData, plantInfo: text })}
                placeholder="Enter plant information"
                multiline
                numberOfLines={8}
                style={[styles.input, styles.descriptionInput]}
                containerStyle={{ ...styles.inputContainer, ...styles.descriptionContainer }}
                placeholderTextColor={commonColors.gray200}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.horizontalInputsContainer}>
              <View style={[styles.inputsContainer, { flex: 1, marginRight: moderateScale(8) }]}>
                <TextComp text="Open Time" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { height: verticalScale(40), justifyContent: 'center' }]}
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
                      if (time) setFormData({ ...formData, openTime: time });
                    }}
                  />
                )}
              </View>

              <View style={[styles.inputsContainer, { flex: 1, marginLeft: moderateScale(8) }]}>
                <TextComp text="Close Time" style={styles.inputLabel} />
                <TouchableOpacity
                  style={[styles.inputContainer, { height: verticalScale(40), justifyContent: 'center' }]}
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
                      if (time) setFormData({ ...formData, closeTime: time });
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Working Days" style={styles.inputLabel} />
              <View style={styles.pickerContainer}>
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
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Description" style={styles.inputLabel} />
              <TextInputComp
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter description"
                multiline
                numberOfLines={8}
                style={[styles.input, styles.descriptionInput]}
                containerStyle={{ ...styles.inputContainer, ...styles.descriptionContainer }}
                placeholderTextColor={commonColors.gray200}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Location" style={styles.inputLabel} />
              <TextInputComp
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Enter location"
                style={styles.input}
              />
            </View>

            <View style={styles.inputsContainer}>
              <TextComp text="Facilities" style={styles.inputLabel} />
              <TextInputComp
                value={formData.facilities}
                onChangeText={(text) => setFormData({ ...formData, facilities: text })}
                placeholder="Enter facilities"
                style={styles.input}
              />
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
                  style={[styles.inputContainer, styles.imageUploadButton]}
                  onPress={pickImage}
                >
                  <Ionicons name="add" size={24} color={colors.buttonSecondary} />
                  <TextComp text="Upload Images" style={styles.imageUploadText} />
                </TouchableOpacity>
              </View>
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
    pickerContainer: {
      padding: 0,
    },
    picker: {
      height: verticalScale(40),
      color: colors.text,
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
    loadingText: {
      fontSize: moderateScale(16),
      color: colors.text,
      textAlign: "center",
    },
  });
};

export default UpdateGreenSpaceForm; 