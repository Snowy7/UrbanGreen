import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";

interface LoadingCompProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingComp: React.FC<LoadingCompProps> = ({ message = "Loading...", fullScreen = false }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={commonColors.primary} />
        <TextComp text={message} style={[styles.message, { color: colors.textSecondary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
    gap: verticalScale(10),
  },
  message: {
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
});

export default LoadingComp; 