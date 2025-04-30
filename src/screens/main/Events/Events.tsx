import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import useIsRTL from "@/hooks/useIsRTL";
import { EventCard } from "@/components/EventCard";
import { Picker } from "@react-native-picker/picker";
import { Id } from "convex/_generated/dataModel";
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "Events">;

const Events = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const isRTL = useIsRTL();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "upcoming" | "past">("all");

  const events = useQuery(api.events.getAll);

  const filteredEvents = events?.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate >= now;
  });

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
      <TextComp 
        text="No Upcoming Events" 
        style={[styles.emptyText, { color: colors.text }]} 
      />
      <TextComp 
        text="There are no upcoming events at the moment. Check back later for new events!" 
        style={[styles.emptySubText, { color: colors.textSecondary }]} 
      />
    </View>
  );

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
            <TextComp text="Events" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.searchContainer}>
            <TextComp text="All Events" style={styles.allText} />
            <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>

            </View>
          </View>

          <FlatList
            data={filteredEvents}
            renderItem={({ item }) => (
              <EventCard
                event={{
                  ...item,
                  location: item.location as unknown as Id<"greenSpaces">,
                }}
                onPress={() => navigation.navigate("EventDetails", { id: item._id })}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
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
  },
  allText: {
    fontSize: moderateScale(12),
    color: commonColors.gray300,
    textDecorationLine: "underline",
  },
  searchContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    marginBottom: verticalScale(15),
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterContainer: {
    width: moderateScale(120),
    borderRadius: moderateScale(10),
    overflow: "hidden",
  },
  picker: {
    height: verticalScale(45),
  },
  listContainer: {
    gap: verticalScale(15),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(50),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  emptySubText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    paddingHorizontal: moderateScale(20),
  },
});

export default Events;
