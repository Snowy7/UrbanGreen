import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, RefreshControl } from "react-native";
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
import { BackArrowIcon, LocationIcon } from "@/assets/icons";
import ButtonComp from "@/components/ButtonComp";
import { Id } from "convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import LoadingComp from "@/components/LoadingComp";
import { useUserProfile } from "@/hooks/useUserProfile";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "EventDetails">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const formatTime = (time: string) => {
  try {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return time;
  }
};

const EventDetails = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { userProfile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const event = useQuery(api.events.getById, { id: id as Id<"events"> });
  const greenSpace = useQuery(api.greenspaces.getById, {
    id: event?.location as Id<"greenSpaces">,
  });
  
  // Check if the user has already joined this event
  const userJoinedEvents = useQuery(
    api.events.getJoinedEvents, 
    userProfile ? { userId: userProfile._id } : null
  );
  
  const isJoined = userJoinedEvents?.some(
    joinedEvent => joinedEvent._id === id
  );
  
  const joinEventMutation = useMutation(api.events.joinEvent);
  const leaveEventMutation = useMutation(api.joinedEvents.leave);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // The queries will automatically refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleJoinEvent = async () => {
    if (!userProfile) {
      Alert.alert("Error", "Please sign in to join events");
      return;
    }

    try {
      setIsLoading(true);
      const result = await joinEventMutation({ eventId: id as Id<"events">, userId: userProfile._id });
      
      if (result.success) {
        // Refresh data after successful join
        onRefresh();
        Alert.alert("Success", result.message);
      } else {
        Alert.alert("Already Registered", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to join event. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLeaveEvent = async () => {
    if (!userProfile) {
      return;
    }
    
    try {
      setIsLoading(true);
      await leaveEventMutation({ eventId: id as Id<"events"> });
      
      // Refresh data after successful leave
      onRefresh();
      Alert.alert("Success", "You have left this event");
    } catch (error) {
      console.error("Error leaving event:", error);
      Alert.alert("Error", "Failed to leave the event. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmLeaveEvent = () => {
    Alert.alert(
      "Leave Event",
      "Are you sure you want to leave this event?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", onPress: handleLeaveEvent, style: "destructive" }
      ]
    );
  };

  if (!event || !greenSpace) {
    return <LoadingComp message="Loading event details..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[commonColors.primary]}
            tintColor={commonColors.primary}
          />
        }
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={["#8CC63F", "#46983C", "#006837"]}
            start={{ x: 0.06, y: 0.06 }}
            end={{ x: 0.92, y: 0.9 }}
            style={styles.heroGradient}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackArrowIcon />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <TextComp text={event.name} style={styles.heroTitle} />
            <View style={styles.categoryBadge}>
              <TextComp text={event.category} style={styles.categoryText} />
            </View>
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={24} color={commonColors.primary} />
              <View>
                <TextComp text="Date" style={[styles.infoLabel, { color: colors.textSecondary }]} />
                <TextComp
                  text={new Date(event.date).toLocaleDateString()}
                  style={[styles.infoValue, { color: colors.text }]}
                />
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={24} color={commonColors.primary} />
              <View>
                <TextComp text="Time" style={[styles.infoLabel, { color: colors.textSecondary }]} />
                <TextComp
                  text={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
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
                  text={greenSpace.name}
                  style={[styles.infoValue, { color: colors.text }]}
                />
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <TextComp text="About Event" style={[styles.sectionTitle, { color: colors.text }]} />
            <TextComp
              text={event.description}
              style={[styles.description, { color: colors.textSecondary }]}
            />
          </View>

          {!userProfile?.isAdmin && userProfile && (
            <>
              {isJoined ? (
                <ButtonComp
                  title="Leave Event"
                  onPress={confirmLeaveEvent}
                  style={styles.leaveButton}
                  isLoading={isLoading}
                  variant="secondary"
                />
              ) : (
                <ButtonComp
                  title="Join Event"
                  onPress={handleJoinEvent}
                  style={styles.joinButton}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
          
          {!userProfile && (
            <TextComp 
              text="Sign in to join this event" 
              style={styles.signInMessage} 
            />
          )}
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
  backButton: {
    position: "absolute",
    top: verticalScale(40),
    left: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: "#ffffff55",
    borderRadius: moderateScale(100),
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
  categoryBadge: {
    backgroundColor: commonColors.white,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(20),
    alignSelf: "flex-start",
  },
  categoryText: {
    color: commonColors.primary,
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  whiteBoard: {
    flex: 1,
    backgroundColor: commonColors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: -moderateScale(20),
    padding: moderateScale(20),
    paddingBottom: verticalScale(40),
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
  joinButton: {
    marginTop: verticalScale(20),
  },
  leaveButton: {
    marginTop: verticalScale(20),
    backgroundColor: commonColors.error,
    borderColor: commonColors.error,
  },
  signInMessage: {
    textAlign: 'center',
    marginTop: verticalScale(20),
    color: commonColors.gray400,
    fontSize: moderateScale(14),
  },
});

export default EventDetails;
