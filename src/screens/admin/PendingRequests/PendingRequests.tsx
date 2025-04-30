import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors, commonColors } from '@/styles/colors';
import TextComp from '@/components/TextComp';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '@/navigation/types';
import { Id } from 'convex/_generated/dataModel';

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, 'PendingRequests'>;

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

const PendingRequests = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();

  const contentRequests = useQuery(api.contentRequests.getAll);
  const greenSpaces = useQuery(api.greenspaces.getAll);
  const pendingRequests = contentRequests?.filter(request => request.status === 'pending');

  const getGreenSpaceName = (locationId: string) => {
    return greenSpaces?.find(g => g._id === locationId)?.name || 'Unknown Location';
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour.toString().padStart(2, '0')}:${minutes}${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const renderNoRequests = () => (
    <View style={styles.noRequestsContainer}>
      <Ionicons name="checkmark-circle-outline" size={48} color={colors.textSecondary} />
      <TextComp text="No Pending Requests" style={[styles.noRequestsText, { color: colors.text }]} />
      <TextComp 
        text="All content requests have been processed." 
        style={[styles.noRequestsSubText, { color: colors.textSecondary }]} 
      />
    </View>
  );

  const renderRequestItem = ({ item }: { item: ContentRequest }) => {
    const isEvent = item.type === 'Add Event';
    const isGreenSpace = item.type === 'Add Green Space' || item.type === 'Update Green Space';

    return (
      <TouchableOpacity
        style={[styles.requestItem, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('RequestDetails', { requestId: item._id })}
      >
        <View style={styles.requestHeader}>
          <TextComp text={item.type} style={[styles.requestTitle, { color: colors.text }]} />
          <View style={[styles.typeBadge, { backgroundColor: commonColors.primary }]}>
            <TextComp text={item.status} style={styles.typeText} />
          </View>
        </View>

        {isEvent && (
          <>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={commonColors.primary} />
              <TextComp text={new Date(item.date || '').toLocaleDateString()} style={[styles.detailText, { color: colors.textSecondary }]} />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={commonColors.primary} />
              <TextComp 
                text={`${formatTime(item.startTime || '')} - ${formatTime(item.endTime || '')}`} 
                style={[styles.detailText, { color: colors.textSecondary }]} 
              />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={commonColors.primary} />
              <TextComp text={getGreenSpaceName(item.eventLocation || '')} style={[styles.detailText, { color: colors.textSecondary }]} />
            </View>
          </>
        )}

        {isGreenSpace && (
          <>
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={16} color={commonColors.primary} />
              <TextComp text={item.greenSpaceName} style={[styles.detailText, { color: colors.textSecondary }]} />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={commonColors.primary} />
              <TextComp text={item.greenSpaceLocation} style={[styles.detailText, { color: colors.textSecondary }]} />
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={commonColors.primary} />
              <TextComp text={item.workingTime} style={[styles.detailText, { color: colors.textSecondary }]} />
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#8CC63F', '#46983C', '#006837']}
            start={{ x: 0.06, y: 0.06 }}
            end={{ x: 0.92, y: 0.9 }}
            style={styles.heroGradient}
          />
          <View style={styles.heroTextContainer}>
            <TextComp text="Pending Requests" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <FlatList<ContentRequest>
            data={pendingRequests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderNoRequests}
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
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: commonColors.white,
  },
  whiteBoard: {
    flex: 1,
    backgroundColor: commonColors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: -moderateScale(20),
    paddingTop: moderateScale(20),
  },
  listContainer: {
    gap: verticalScale(15),
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(20),
  },
  requestItem: {
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    backgroundColor: commonColors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: moderateScale(4),
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  requestTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    flex: 1,
    marginRight: moderateScale(10),
  },
  typeBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(15),
  },
  typeText: {
    color: commonColors.white,
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    marginBottom: verticalScale(5),
  },
  detailText: {
    fontSize: moderateScale(14),
  },
  noRequestsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(50),
  },
  noRequestsText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  noRequestsSubText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
});

export default PendingRequests;