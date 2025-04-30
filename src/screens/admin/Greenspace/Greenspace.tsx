import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "@/navigation/types";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import WrapperContainer from "@/components/WrapperContainer";
import HeaderComp from "@/components/HeaderComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { useGreenSpaces } from "@/hooks/useGreenSpaces";
import { GreenspaceCard } from "@/components/GreenspaceCard";
import { Id } from "convex/_generated/dataModel";
import { LinearGradient } from "expo-linear-gradient";
import useRTLStyles from "./styles";
import useIsRTL from "@/hooks/useIsRTL";
import { BackArrowIcon } from "@/assets/icons";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, "Greenspace">;

const GreenspaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const { greenSpaces, deleteGreenSpace } = useGreenSpaces();
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedGreenspaceId, setSelectedGreenspaceId] = useState<Id<"greenSpaces"> | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (greenSpaces !== undefined) {
      setLoading(false);
    }
  }, [greenSpaces]);

  const handleDelete = async (id: Id<"greenSpaces">) => {
    setSelectedGreenspaceId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedGreenspaceId) return;

    try {
      setDeleteLoading(true);
      await deleteGreenSpace({ id: selectedGreenspaceId });
      setDeleteModalVisible(false);
      setSelectedGreenspaceId(null);
    } catch (error) {
      console.error("Error deleting greenspace:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <GreenspaceCard
      greenspace={item}
      onPress={() => navigation.navigate("GreenspaceDetails", { id: item._id })}
      onDelete={() => handleDelete(item._id)}
      onEdit={() => navigation.navigate("UpdateGreenspace", { id: item._id })}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <TextComp text="NO_GREENSPACES_AVAILABLE" style={styles.emptyText} />
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
            <TextComp text={`Manage Green Spaces`} style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <FlatList
            data={greenSpaces}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            refreshing={loading}
            onRefresh={() => setLoading(true)}
          />
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("AddGreenspace")} style={styles.addGreenspaceButton}>
        <Ionicons name="add" size={24} color={commonColors.white} />
        <TextComp text="ADD_GREENSPACE" style={styles.addGreenspaceText} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <BackArrowIcon />
      </TouchableOpacity>

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedGreenspaceId(null);
        }}
        onConfirm={confirmDelete}
        title="DELETE_CONFIRMATION"
        message="DELETE_GREENSPACE_CONFIRMATION"
        isLoading={deleteLoading}
      />
    </View>
  );
};

export default GreenspaceScreen;
