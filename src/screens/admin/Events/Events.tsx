import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "@/navigation/types";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import WrapperContainer from "@/components/WrapperContainer";
import HeaderComp from "@/components/HeaderComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { EventCard } from "@/components/EventCard";
import { LinearGradient } from "expo-linear-gradient";
import useRTLStyles from "./styles";
import useIsRTL from "@/hooks/useIsRTL";
import { BackArrowIcon } from "@/assets/icons";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, "Events">;

const EventsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const events = useQuery(api.events.getAll);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      // The query will automatically refetch when the screen comes into focus
      setLoading(false);
    }, [])
  );

  const handleDelete = async (id: string) => {
    setSelectedEventId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedEventId) return;

    try {
      setDeleteLoading(true);
      // TODO: Implement event deletion
      console.log("Deleting event:", selectedEventId);
      setDeleteModalVisible(false);
      setSelectedEventId(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      onPress={() => navigation.navigate("EventDetails", { id: item._id })}
      onDelete={() => handleDelete(item._id)}
      onEdit={() => navigation.navigate("UpdateEvent", { id: item._id })}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <TextComp text="NO_EVENTS_AVAILABLE" style={styles.emptyText} />
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
            <TextComp text="MANAGE_EVENTS" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={styles.listFooter} />}
          />
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("AddEvent")} style={styles.addEventButton}>
        <Ionicons name="add" size={24} color={commonColors.white} />
        <TextComp text="ADD_EVENT" style={styles.addEventText} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedEventId(null);
        }}
        onConfirm={confirmDelete}
        title="DELETE_CONFIRMATION"
        message="DELETE_EVENT_CONFIRMATION"
        isLoading={deleteLoading}
      />
    </View>
  );
};

export default EventsScreen; 