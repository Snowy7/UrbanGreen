import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { CalendarIcon, ClockIcon, LocationIcon } from "@/assets/icons";
import { t } from "i18next";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

interface EventCardProps {
  event: {
    _id: string;
    name: string;
    category: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    location: Id<"greenSpaces">;
  };
  onPress: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, onDelete, onEdit }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  // Fetch the green space details
  const greenSpace = useQuery(api.greenspaces.getById, { id: event.location });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "\\");
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <TouchableOpacity style={styles.eventCardContainer} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.eventCard}>
        <View style={styles.eventCardTitleContainer}>
          <View style={styles.dot} />
          <TextComp text={`EVENT_TYPES.${event.category}`} style={styles.eventCardTitle} />
        </View>
        <View style={styles.eventCardContent}>
          <TextComp text={event.name} style={styles.eventCardTitle} />
          <TextComp
            text={event.description}
            style={styles.eventCardDescription}
            numberOfLines={2}
          />
          <View style={styles.eventCardDateContainer}>
            <CalendarIcon
              color={commonColors.primary}
              width={moderateScale(15)}
              height={moderateScale(15)}
            />
            <TextComp text={formatDate(event.date)} style={styles.eventCardDate} />
            <ClockIcon
              color={commonColors.primary}
              width={moderateScale(15)}
              height={moderateScale(15)}
            />
            <TextComp
              text={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
              style={styles.eventCardDate}
            />
          </View>
          <View style={styles.eventCardDateContainer}>
            <Ionicons name="location-outline" size={18} color={commonColors.primary} />
            <TextComp text={greenSpace?.name || "Loading..."} style={styles.eventCardDate} />
          </View>
        </View>
        <View style={styles.eventCardBottomSection}></View>
        {(onDelete || onEdit) && (
          <View style={styles.actionsContainer}>
            {onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Ionicons name="pencil-outline" size={20} color={commonColors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Ionicons name="trash-outline" size={20} color={commonColors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCardContainer: {
    width: "100%",
    height: moderateScale(180),
    backgroundColor: commonColors.white,
    borderRadius: moderateScale(10),
    shadowColor: commonColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: verticalScale(10),
  },
  eventCard: {
    width: "100%",
    height: "100%",
    padding: moderateScale(10),
  },
  eventCardContent: {
    flex: 1,
    paddingVertical: verticalScale(10),
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  eventCardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
    marginTop: verticalScale(10),
  },
  eventCardTitle: {
    fontSize: moderateScale(12),
    fontWeight: "medium",
    color: commonColors.primary,
  },
  dot: {
    width: moderateScale(5),
    height: moderateScale(5),
    backgroundColor: commonColors.primary,
    borderRadius: moderateScale(5),
  },
  eventCardDescription: {
    fontSize: moderateScale(12),
    fontWeight: "medium",
    color: commonColors.gray300,
    // max 2 lines
    maxWidth: "100%",
    wordWrap: "break-word",
    textOverflow: "ellipsis",
  },
  eventCardDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
    marginTop: verticalScale(10),
  },
  eventCardDate: {
    fontSize: moderateScale(12),
    fontWeight: "medium",
    color: commonColors.gray300,
  },
  eventCardBottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: moderateScale(10),
    backgroundColor: commonColors.primary,
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
  },
  actionsContainer: {
    position: "absolute",
    top: moderateScale(10),
    right: moderateScale(10),
    flexDirection: "row",
    gap: moderateScale(8),
  },
  actionButton: {
    padding: moderateScale(4),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: moderateScale(20),
  },
});
