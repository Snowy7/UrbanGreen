import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors, ThemeColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import WrapperContainer from "@/components/WrapperContainer";
import HeaderComp from "@/components/HeaderComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "ContentRequests">;

const ContentRequests = () => {
  const { theme } = useTheme();
  const colors = Colors[theme] as ThemeColors;
  const { userProfile } = useUserProfile();
  const navigation = useNavigation<NavigationProp>();
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "approved" | "rejected">(
    "all"
  );

  const contentRequests = useQuery(api.contentRequests.getByUserId, {
    userId: userProfile?._id as Id<"users">,
  });

  const greenSpaces = useQuery(api.greenspaces.getAll);

  const getGreenSpaceName = (locationId: string) => {
    const greenSpace = greenSpaces?.find((gs) => gs._id === locationId);
    return greenSpace?.name || "Unknown Location";
  };

  const filteredRequests = contentRequests?.filter((request) => {
    if (selectedTab === "all") return true;
    return request.status === selectedTab;
  });

  const renderButton = (title: string, onPress: () => void, icon: string) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Ionicons
          name={icon as any}
          size={24}
          color={commonColors.primary}
          style={styles.buttonIcon}
        />
        <TextComp text={title} style={[styles.buttonText, { color: colors.text }]} />
      </View>
    </TouchableOpacity>
  );

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  const renderRequestItem = ({ item }) => {
    const isEvent = item.type === "Add Event";
    const isGreenSpace = item.type === "Add Green Space" || item.type === "Update Green Space";

    return (
      <TouchableOpacity
        style={[styles.requestItem, { backgroundColor: colors.surface }]}
        onPress={() => {}}
      >
        <View style={styles.requestHeader}>
          <TextComp
            text={item.greenSpaceName || item.title || "Untitled Request"}
            style={[styles.requestTitle, { color: colors.text }]}
          />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <TextComp text={item.status} style={styles.statusText} />
          </View>
        </View>

        {isEvent && (
          <>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={commonColors.primary} />
              <TextComp
                text={item.date ? new Date(item.date).toLocaleDateString() : "No date"}
                style={[styles.detailText, { color: colors.textSecondary }]}
              />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={commonColors.primary} />
              <TextComp
                text={
                  item.startTime && item.endTime ?
                    `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`
                  : "No time"
                }
                style={[styles.detailText, { color: colors.textSecondary }]}
              />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={commonColors.primary} />
              <TextComp
                text={getGreenSpaceName(item.eventLocation)}
                style={[styles.detailText, { color: colors.textSecondary }]}
              />
            </View>
          </>
        )}

        {isGreenSpace && (
          <>
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={16} color={commonColors.primary} />
              <TextComp
                text={item.greenSpaceName || "No name"}
                style={[styles.detailText, { color: colors.textSecondary }]}
              />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={commonColors.primary} />
              <TextComp
                text={item.greenSpaceLocation || "No location"}
                style={[styles.detailText, { color: colors.textSecondary }]}
              />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={commonColors.primary} />
              <TextComp
                text={item.workingTime || "No working hours"}
                style={[styles.detailText, { color: colors.textSecondary }]}
              />
            </View>
          </>
        )}

        <View style={styles.requestFooter}>
          <TextComp
            text={`Type: ${item.type}`}
            style={[styles.requestType, { color: colors.textSecondary }]}
          />
          <TextComp
            text={new Date(item._creationTime).toLocaleDateString()}
            style={[styles.requestDate, { color: colors.textSecondary }]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#999999";
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
            <TextComp text="Content Requests" style={styles.heroText} />

            {renderButton(
              "Submit New Request",
              () => navigation.navigate("SubmitContentRequest"),
              "add-circle-outline"
            )}
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.tabContainer}>
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  selectedTab === tab && { backgroundColor: commonColors.primary },
                ]}
                onPress={() => setSelectedTab(tab as any)}
              >
                <TextComp
                  text={tab.charAt(0).toUpperCase() + tab.slice(1)}
                  style={[styles.tabText, selectedTab === tab && { color: commonColors.white }]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filteredRequests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    height: verticalScale(200),
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
    marginTop: verticalScale(20),
  },
  heroText: {
    fontSize: moderateScale(32),
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
  profileSection: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(10),
  },
  profileName: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: commonColors.secondary,
  },
  button: {
    marginTop: verticalScale(10),
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    shadowColor: commonColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: moderateScale(10),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    marginBottom: verticalScale(15),
  },
  tab: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: commonColors.gray100,
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    color: commonColors.black,
  },
  listContainer: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  requestItem: {
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    backgroundColor: commonColors.white,
    marginHorizontal: moderateScale(2),
    shadowColor: commonColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  requestTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(15),
  },
  statusText: {
    color: commonColors.white,
    fontSize: moderateScale(12),
    fontWeight: "500",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
    marginBottom: verticalScale(5),
  },
  detailText: {
    fontSize: moderateScale(14),
  },
  requestFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: commonColors.gray100,
  },
  requestType: {
    fontSize: moderateScale(12),
  },
  requestDate: {
    fontSize: moderateScale(12),
  },
});

export default ContentRequests;
