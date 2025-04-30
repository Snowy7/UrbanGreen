import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors, commonColors } from '@/styles/colors';
import TextComp from '@/components/TextComp';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { Ionicons } from '@expo/vector-icons';
import { Id } from 'convex/_generated/dataModel';

interface ContentRequest {
  _id: Id<"contentRequests">;
  _creationTime: number;
  type: string;
  status: string;
  userId: Id<"users">;
  // Event fields
  name?: string;
  category?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  eventDescription?: string;
  eventLocation?: string;
  // Green Space fields
  greenSpaceName?: string;
  entryPrice?: number;
  plantInfo?: string;
  workingTime?: string;
  workingDays?: string;
  greenSpaceDescription?: string;
  greenSpaceLocation?: string;
  facilities?: string;
  images?: string[];
}

interface RequestDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  request: ContentRequest | null;
  onApprove: (id: Id<"contentRequests">) => void;
  onReject: (id: Id<"contentRequests">) => void;
}

const RequestDetailsModal = ({ visible, onClose, request, onApprove, onReject }: RequestDetailsModalProps) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  if (!request) return null;

  const isEvent = request.type === 'Add Event';
  const isGreenSpace = request.type === 'Add Green Space' || request.type === 'Update Green Space';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <TextComp text={request.type} style={[styles.modalTitle, { color: colors.text }]} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {isEvent && (
              <>
                <View style={styles.section}>
                  <TextComp text="Event Details" style={[styles.sectionTitle, { color: colors.text }]} />
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={20} color={commonColors.primary} />
                    <TextComp text={new Date(request.date || '').toLocaleDateString()} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={20} color={commonColors.primary} />
                    <TextComp text={`${request.startTime} - ${request.endTime}`} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.eventLocation} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="document-text-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.eventDescription} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                </View>
              </>
            )}

            {isGreenSpace && (
              <>
                <View style={styles.section}>
                  <TextComp text="Green Space Details" style={[styles.sectionTitle, { color: colors.text }]} />
                  <View style={styles.detailItem}>
                    <Ionicons name="business-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.greenSpaceName} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.greenSpaceLocation} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.workingTime} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.workingDays} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash-outline" size={20} color={commonColors.primary} />
                    <TextComp text={`Entry Price: $${request.entryPrice}`} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="leaf-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.plantInfo} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="document-text-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.greenSpaceDescription} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="build-outline" size={20} color={commonColors.primary} />
                    <TextComp text={request.facilities} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => onApprove(request._id)}
            >
              <Ionicons name="checkmark" size={20} color={commonColors.white} />
              <TextComp text="Approve" style={styles.actionButtonText} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => onReject(request._id)}
            >
              <Ionicons name="close" size={20} color={commonColors.white} />
              <TextComp text="Reject" style={styles.actionButtonText} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  modalTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
  closeButton: {
    padding: moderateScale(5),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  detailText: {
    fontSize: moderateScale(16),
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: moderateScale(10),
    marginTop: verticalScale(20),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(20),
    gap: moderateScale(5),
  },
  approveButton: {
    backgroundColor: commonColors.success,
  },
  rejectButton: {
    backgroundColor: commonColors.error,
  },
  actionButtonText: {
    color: commonColors.white,
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
});

export default RequestDetailsModal; 