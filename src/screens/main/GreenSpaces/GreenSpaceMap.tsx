import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "@/navigation/types";
import { BackArrowIcon } from "@/assets/icons";
import { TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import LoadingComp from "@/components/LoadingComp";

type NavigationProp = NativeStackNavigationProp<MainStackParamList, "GreenSpaceMap">;

const GreenSpaceMap = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { id } = route.params as { id: string };

  const greenSpace = useQuery(api.greenspaces.getById, { id: id as Id<"greenSpaces"> });

  if (!greenSpace) {
    return <LoadingComp message="Loading map..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <View style={styles.heroTextContainer}>
          <TextComp text="Interactive Map" style={styles.heroText} />
        </View>
      </View>

      <View style={styles.whiteBoard}>
        <Image 
          source={require("@/assets/images/FakeMap.png")}
          style={styles.map}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  backButton: {
    position: "absolute",
    top: verticalScale(40),
    left: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: "#ffffff55",
    borderRadius: moderateScale(100),
    zIndex: 1,
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
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default GreenSpaceMap; 