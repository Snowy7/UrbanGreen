import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { BackArrowIcon, LocationIcon, HeartIcon } from "@/assets/icons";
import ButtonComp from "@/components/ButtonComp";
import { Id } from "convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { useUserProfile } from "@/hooks/useUserProfile";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "GreenSpaceDetails">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GreenSpaceDetails = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { userProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"overview" | "photos" | "details">("overview");
  const [isFavoriting, setIsFavoriting] = useState(false);

  const greenSpace = useQuery(api.greenspaces.getById, { id: id as Id<"greenSpaces"> });
  const isFavorited = useQuery(api.favorites.isFavorited, {
    greenSpaceId: id as Id<"greenSpaces">,
    userId: userProfile?._id as any,
  });
  const toggleFavoriteMutation = useMutation(api.favorites.toggleFavorite);

  const handleToggleFavorite = async () => {
    if (!userProfile?._id) {
      Alert.alert("Error", "Please sign in to add favorites");
      return;
    }

    try {
      setIsFavoriting(true);
      const result = await toggleFavoriteMutation({
        greenSpaceId: id as Id<"greenSpaces">,
        userId: userProfile?._id as any,
      });
      if (result.success) {
        Alert.alert("Success", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update favorite. Please try again later.");
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleOpenInMap = () => {
    navigation.navigate("GreenSpaceMap", { id });
  };

  if (!greenSpace) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TextComp text="Loading..." style={{ color: colors.text }} />
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <TextComp
                text="Description"
                style={[styles.sectionTitle, { color: commonColors.secondary }]}
              />
              <TextComp
                text={greenSpace.description}
                style={[styles.description, { color: colors.textSecondary }]}
              />
            </View>

            <View style={styles.card}>
              <TextComp
                text="Plant Info"
                style={[styles.sectionTitle, { color: commonColors.secondary }]}
              />
              <TextComp
                text={greenSpace.plantInfo}
                style={[styles.description, { color: colors.textSecondary }]}
              />
            </View>

            <View style={styles.card}>
              <TextComp
                text="Facilities"
                style={[styles.sectionTitle, { color: commonColors.secondary }]}
              />
              <TextComp
                text={greenSpace.facilities}
                style={[styles.description, { color: colors.textSecondary }]}
              />
            </View>

            {!userProfile?.isAdmin && (
              <TouchableOpacity style={styles.mapButton} onPress={handleOpenInMap}>
                <Ionicons name="map-outline" size={24} color={commonColors.white} />
                <TextComp text="Open in Map" style={styles.mapButtonText} />
              </TouchableOpacity>
            )}
          </View>
        );
      case "photos":
        return (
          <View style={styles.tabContent}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.gallery}>
              {greenSpace.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
              ))}
            </ScrollView>
          </View>
        );
      case "details":
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={24} color={commonColors.primary} />
                <View>
                  <TextComp
                    text="Working Hours"
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  />
                  <TextComp
                    text={greenSpace.workingTime}
                    style={[styles.infoValue, { color: colors.text }]}
                  />
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={24} color={commonColors.primary} />
                <View>
                  <TextComp
                    text="Working Days"
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  />
                  <TextComp
                    text={greenSpace.workingDays}
                    style={[styles.infoValue, { color: colors.text }]}
                  />
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={24} color={commonColors.primary} />
                <View>
                  <TextComp
                    text="Location"
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  />
                  <TextComp
                    text={greenSpace.location}
                    style={[styles.infoValue, { color: colors.text }]}
                  />
                </View>
              </View>

              {/* price */}
              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={24} color={commonColors.primary} />
                <View>
                  <TextComp
                    text="Entry Price"
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  />
                  <TextComp
                    text={`SAR ${greenSpace.entryPrice}`}
                    style={[styles.infoValue, { color: colors.text }]}
                  />
                </View>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: greenSpace.images[0] || "https://via.placeholder.com/150" }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["#8CC63F50", "#8CC63F90", "#3B903A9a", "#006837aa"]}
            locations={[0.11, 0.47, 0.75, 1]}
            style={styles.heroGradient}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackArrowIcon />
          </TouchableOpacity>
          {!userProfile?.isAdmin && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              disabled={isFavoriting}
            >
              <HeartIcon
                color={isFavorited ? commonColors.primary : commonColors.white}
                width={moderateScale(24)}
                height={moderateScale(24)}
              />
            </TouchableOpacity>
          )}
          <View style={styles.heroContent}>
            <TextComp text={greenSpace.name} style={styles.heroTitle} />
            <View style={styles.locationContainer}>
              <LocationIcon
                color={commonColors.white}
                width={moderateScale(15)}
                height={moderateScale(15)}
              />
              <TextComp text={greenSpace.location} style={styles.locationText} />
            </View>
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "overview" && styles.activeTab]}
              onPress={() => setActiveTab("overview")}
            >
              <TextComp
                text="Overview"
                style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "photos" && styles.activeTab]}
              onPress={() => setActiveTab("photos")}
            >
              <TextComp
                text="Photos"
                style={[styles.tabText, activeTab === "photos" && styles.activeTabText]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "details" && styles.activeTab]}
              onPress={() => setActiveTab("details")}
            >
              <TextComp
                text="Details"
                style={[styles.tabText, activeTab === "details" && styles.activeTabText]}
              />
            </TouchableOpacity>
          </View>

          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: verticalScale(300),
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(300),
  },
  backButton: {
    position: "absolute",
    top: verticalScale(40),
    left: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: "#ffffff55",
    borderRadius: moderateScale(100),
    zIndex: 1,
  },
  heroContent: {
    position: "absolute",
    bottom: verticalScale(30),
    left: moderateScale(20),
    right: moderateScale(20),
  },
  heroTitle: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: commonColors.white,
    marginBottom: verticalScale(10),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
  },
  locationText: {
    color: commonColors.white,
    fontSize: moderateScale(14),
  },
  whiteBoard: {
    flex: 1,
    backgroundColor: commonColors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: -moderateScale(20),
    padding: moderateScale(20),
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: commonColors.gray200,
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(10),
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: commonColors.primary,
  },
  tabText: {
    fontSize: moderateScale(14),
    color: commonColors.gray400,
  },
  activeTabText: {
    color: commonColors.primary,
    fontWeight: "500",
  },
  tabContent: {
    marginBottom: verticalScale(20),
  },
  infoSection: {
    gap: verticalScale(15),
    marginBottom: verticalScale(20),
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(15),
  },
  infoLabel: {
    fontSize: moderateScale(12),
    marginBottom: verticalScale(2),
  },
  infoValue: {
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  descriptionSection: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  description: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  facilitiesSection: {
    marginBottom: verticalScale(20),
  },
  facilities: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  gallery: {
    flexDirection: "row",
    gap: moderateScale(10),
  },
  galleryImage: {
    width: SCREEN_WIDTH - moderateScale(40),
    height: verticalScale(150),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  detailsSection: {
    marginBottom: verticalScale(20),
  },
  detailsText: {
    fontSize: moderateScale(16),
    fontWeight: "500",
  },
  bookButton: {
    marginTop: verticalScale(20),
  },
  card: {
    backgroundColor: commonColors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteButton: {
    position: "absolute",
    top: verticalScale(40),
    right: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: "#ffffff55",
    borderRadius: moderateScale(100),
  },
  mapButton: {
    position: "absolute",
    bottom: verticalScale(-35),
    left: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: commonColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    shadowColor: commonColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapButtonText: {
    color: commonColors.white,
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginLeft: moderateScale(8),
  },
});

export default GreenSpaceDetails;
