import React, { useState } from "react";
import { View, StyleSheet, FlatList, TextInput } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import useIsRTL from "@/hooks/useIsRTL";
import { Picker } from "@react-native-picker/picker";
import { GreenspaceCard } from "@/components/GreenspaceCard";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "GreenSpaces">;

const GreenSpaces = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const isRTL = useIsRTL();
  const [searchQuery, setSearchQuery] = useState("");

  const greenSpaces = useQuery(api.greenspaces.getAll);

  const filteredSpaces = greenSpaces?.filter((space) => {
    // Apply search filter
    const matchesSearch =
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Add other filter logic here
    return matchesSearch;
  });

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
            <TextComp text="Greenspaces" style={styles.heroText} />
            <View style={[styles.searchInputContainer]}>
              <Ionicons
                name="search"
                size={20}
                color={colors.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search green spaces..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.searchContainer}>
            <TextComp text="All Greenspaces" style={styles.allText} />
            <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>

            </View>
          </View>

          <FlatList
            data={filteredSpaces}
            renderItem={({ item }) => (
              <GreenspaceCard
                greenspace={item}
                onPress={() => navigation.navigate("GreenSpaceDetails", { id: item._id })}
              />
            )}
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
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    maxHeight: verticalScale(40),
    backgroundColor: "#f0f0f0",
    width: "80%",
    alignSelf: "center",
    marginTop: verticalScale(10),
  },
  searchIcon: {
    marginRight: moderateScale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
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
});

export default GreenSpaces;
