import React from "react";
import { View, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, commonColors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import ButtonComp from "@/components/ButtonComp";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  buttonText?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  buttonText = "DELETE",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TextComp text={title} style={styles.title} />
          <TextComp text={message} style={styles.message} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <TextComp text="CANCEL" style={styles.cancelButtonText} />
            </TouchableOpacity>
            <ButtonComp
              title={buttonText}
              onPress={onConfirm}
              isLoading={isLoading}
              style={styles.deleteButton}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: commonColors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    width: "80%",
    maxWidth: moderateScale(400),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: commonColors.error,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  message: {
    fontSize: moderateScale(14),
    color: commonColors.gray500,
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(12),
  },
  cancelButton: {
    flex: 1,
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: commonColors.gray300,
    alignItems: "center",
  },
  cancelButtonText: {
    color: commonColors.gray500,
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
  },
});

export default DeleteConfirmationModal; 