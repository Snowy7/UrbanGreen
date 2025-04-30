import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { commonColors } from "@/styles/colors";

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color={commonColors.primary} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  box: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
});

export default LoadingOverlay;
