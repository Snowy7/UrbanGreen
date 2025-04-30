import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors, commonColors } from '@/styles/colors';
import TextComp from '@/components/TextComp';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '@/navigation/types';
import { Id } from 'convex/_generated/dataModel';

type NavigationProp = NativeStackNavigationProp<AdminStackParamList, 'RequestDetails'>;
type RouteProps = RouteProp<AdminStackParamList, 'RequestDetails'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = SCREEN_WIDTH * 0.4;

const RequestDetails = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { requestId } = route.params;

  const contentRequests = useQuery(api.contentRequests.getAll);
  const updateRequest = useMutation(api.contentRequests.update);
  const createEvent = useMutation(api.events.create);
  const createGreenSpace = useMutation(api.greenspaces.create);
  const updateGreenSpace = useMutation(api.greenspaces.update);
  
  const request = contentRequests?.find(r => r._id === requestId);
  const greenSpaces = useQuery(api.greenspaces.getAll);
  const eventLocation = request?.type === 'Add Event' && request.eventLocation ? 
    greenSpaces?.find(g => g._id === request.eventLocation)?.name : '';

  const handleApprove = async () => {
    try {
      if (!request) return;

      if (request.type === 'Add Event') {
        await createEvent({
          name: request.name || '',
          category: request.category || '',
          date: request.date || '',
          startTime: request.startTime || '',
          endTime: request.endTime || '',
          description: request.eventDescription || '',
          location: request.eventLocation || '',
        });
      } else if (request.type === 'Add Greenspace') {
        await createGreenSpace({
          name: request.greenSpaceName || '',
          entryPrice: request.entryPrice || 0,
          plantInfo: request.plantInfo || '',
          workingTime: request.workingTime || '',
          workingDays: request.workingDays || '',
          description: request.greenSpaceDescription || '',
          location: request.greenSpaceLocation || '',
          facilities: request.facilities || '',
          images: request.images || [],
        });
      } else if (request.type === 'Update Greenspace') {
        if (!request._id) return;
        await updateGreenSpace({
          id: request._id,
          name: request.greenSpaceName,
          entryPrice: request.entryPrice,
          plantInfo: request.plantInfo,
          workingTime: request.workingTime,
          workingDays: request.workingDays,
          description: request.greenSpaceDescription,
          location: request.greenSpaceLocation,
          facilities: request.facilities,
          images: request.images,
        });
      }

      await updateRequest({ id: request._id, status: 'approved' });
      navigation.goBack();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async () => {
    try {
      if (!request) return;
      await updateRequest({ id: request._id, status: 'rejected' });
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (!request) {
    return (
      <View style={styles.container}>
        <TextComp text="Request not found" style={styles.errorText} />
      </View>
    );
  }

  const isEvent = request.type === 'Add Event';
  const isGreenSpace = request.type === 'Add Greenspace' || request.type === 'Update Greenspace';

  const getHeroTitle = () => {
    if (isEvent) return request.name || '';
    if (isGreenSpace) return request.greenSpaceName || '';
    return '';
  };

  const getSubHeroText = () => {
    if (isEvent) return request.category || '';
    if (isGreenSpace) return request.plantInfo || '';
    return '';
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={commonColors.white} />
          </TouchableOpacity>
          <View style={styles.heroTextContainer}>
            <TextComp text={getHeroTitle()} style={styles.heroText} />
            <TextComp text={getSubHeroText()} style={styles.subHeroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.requestHeader}>
              <TextComp text={request.type} style={[styles.requestTitle, { color: colors.text }]} />
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                <TextComp text={request.status} style={styles.statusText} />
              </View>
            </View>

            {isEvent && (
              <>
                <View style={styles.section}>
                  <TextComp text="Event Details" style={styles.sectionTitle} />
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={commonColors.primary} />
                    <TextComp text={new Date(request.date || '').toLocaleDateString()} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={commonColors.primary} />
                    <TextComp 
                      text={`${formatTime(request.startTime || '')} - ${formatTime(request.endTime || '')}`} 
                      style={[styles.detailText, { color: colors.textSecondary }]} 
                    />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={16} color={commonColors.primary} />
                    <TextComp text={eventLocation} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="document-text-outline" size={16} color={commonColors.primary} />
                    <TextComp text={request.eventDescription} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                </View>
              </>
            )}

            {isGreenSpace && (
              <>
                <View style={styles.section}>
                  <TextComp text="Green space Details" style={styles.sectionTitle} />
                  <View style={styles.detailItem}>
                    <Ionicons name="business-outline" size={16} color={commonColors.primary} />
                    <TextComp text={request.greenSpaceName} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={16} color={commonColors.primary} />
                    <TextComp text={request.greenSpaceLocation} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={commonColors.primary} />
                    <TextComp text={request.workingTime} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={commonColors.primary} />
                    <View style={styles.workingDaysContainer}>
                      {request.workingDays?.split(',').map((day, index) => (
                        <View key={index} style={styles.dayBadge}>
                          <TextComp text={day.trim()} style={styles.dayText} />
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="pricetag-outline" size={16} color={commonColors.primary} />
                    <TextComp text={`${request.entryPrice} SAR`} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="leaf-outline" size={16} color={commonColors.primary} />
                    <TextComp text={request.plantInfo} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="build-outline" size={16} color={commonColors.primary} />
                    <TextComp text={request.facilities} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="document-text-outline" size={16} color={commonColors.primary} />
                    <TextComp text={request.greenSpaceDescription} style={[styles.detailText, { color: colors.textSecondary }]} />
                  </View>
                  
                  {request.images && request.images.length > 0 && (
                    <View style={styles.imagesSection}>
                      <TextComp text="Images" style={styles.sectionTitle} />
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.imagesContainer}
                      >
                        {request.images.map((imageUrl, index) => (
                          <View key={index} style={styles.imageWrapper}>
                            <Image 
                              source={{ uri: imageUrl }} 
                              style={styles.image}
                              resizeMode="cover"
                            />
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </>
            )}

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={commonColors.white} />
                <TextComp text="Approve" style={styles.actionButtonText} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleReject}
              >
                <Ionicons name="close-circle-outline" size={20} color={commonColors.white} />
                <TextComp text="Reject" style={styles.actionButtonText} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FFA500';
    case 'approved':
      return '#4CAF50';
    case 'rejected':
      return '#F44336';
    default:
      return '#999999';
  }
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
  backButton: {
    position: 'absolute',
    left: moderateScale(16),
    top: moderateScale(60),
    zIndex: 1,
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  heroText: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: commonColors.white,
    textAlign: 'center',
  },
  subHeroText: {
    fontSize: moderateScale(16),
    color: commonColors.white,
    marginTop: verticalScale(5),
    opacity: 0.8,
    textAlign: 'center',
  },
  whiteBoard: {
    flex: 1,
    backgroundColor: commonColors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: -moderateScale(20),
    padding: moderateScale(20),
  },
  scrollView: {
    flex: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  requestTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(15),
  },
  statusText: {
    color: commonColors.white,
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    color: commonColors.primary,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    marginBottom: verticalScale(10),
  },
  detailText: {
    fontSize: moderateScale(16),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(10),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
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
  errorText: {
    fontSize: moderateScale(18),
    color: commonColors.error,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  workingDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(5),
  },
  dayBadge: {
    backgroundColor: commonColors.primary,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  dayText: {
    color: commonColors.white,
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  imagesSection: {
    marginTop: verticalScale(20),
  },
  imagesContainer: {
    paddingRight: moderateScale(20),
    gap: moderateScale(15),
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    backgroundColor: commonColors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default RequestDetails; 