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
import { MainStackParamList } from '@/navigation/types';
import { useAuth } from '@clerk/clerk-expo';
import { CalendarIcon, ClockIcon, LocationIcon } from '@/assets/icons';
import LoadingComp from '@/components/LoadingComp';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'JoinedEvents'>;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '\\');
};

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const JoinedEvents = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const { userId } = useAuth();

  const joinedEvents = useQuery(api.events.getJoinedEvents, {
    userId: userId || "",
  });

  if (!joinedEvents) {
    return <LoadingComp message="Loading your events..." />;
  }

  const renderNoEvents = () => (
    <View style={styles.noEventsContainer}>
      <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
      <TextComp text="No Joined Events" style={[styles.noEventsText, { color: colors.text }]} />
      <TextComp 
        text="You haven't joined any events yet. Browse events to find something interesting!" 
        style={[styles.noEventsSubText, { color: colors.textSecondary }]} 
      />
    </View>
  );

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCardContainer} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate("EventDetails", { id: item._id })}
    >
      <View style={styles.eventCard}>
        <View style={styles.eventCardTitleContainer}>
          <View style={styles.dot} />
          <TextComp text={item.category} style={styles.eventCardTitle} />
        </View>
        <View style={styles.eventCardContent}>
          <TextComp text={item.name} style={styles.eventCardTitle} />
          <TextComp
            text={item.description}
            style={styles.eventCardDescription}
          />
          <View style={styles.eventCardDateContainer}>
            <CalendarIcon
              color={commonColors.primary}
              width={moderateScale(15)}
              height={moderateScale(15)}
            />
            <TextComp text={formatDate(item.date)} style={styles.eventCardDate} />
            <ClockIcon
              color={commonColors.primary}
              width={moderateScale(15)}
              height={moderateScale(15)}
            />
            <TextComp text={`${formatTime(item.startTime)} - ${formatTime(item.endTime)}`} style={styles.eventCardDate} />
          </View>
        </View>
        <View style={styles.eventCardBottomSection}></View>
      </View>
    </TouchableOpacity>
  );

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
            <TextComp text="Joined Events" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.searchContainer}>
            <TextComp text="All Joined Events" style={styles.allText} />
            <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
            </View>
          </View>

          <FlatList
            data={joinedEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderNoEvents}
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
    padding: moderateScale(20),
  },
  listContainer: {
    gap: verticalScale(15),
  },
  eventCardContainer: {
    width: '100%',
    backgroundColor: commonColors.white,
    borderRadius: moderateScale(10),
    shadowColor: commonColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: verticalScale(10),
  },
  eventCard: {
    width: '100%',
    height: '100%',
    padding: moderateScale(10),
  },
  eventCardContent: {
    flex: 1,
    paddingVertical: verticalScale(10),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  eventCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    marginTop: verticalScale(10),
  },
  eventCardTitle: {
    fontSize: moderateScale(12),
    fontWeight: 'medium',
    color: commonColors.primary,
  },
  dot: {
    width: moderateScale(5),
    height: moderateScale(5),
    backgroundColor: commonColors.primary,
    borderRadius: moderateScale(5),
  },
  eventCardDescription: {
    fontSize: moderateScale(12),
    fontWeight: 'medium',
    color: commonColors.gray300,
  },
  eventCardDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    marginTop: verticalScale(10),
  },
  eventCardDate: {
    fontSize: moderateScale(12),
    fontWeight: 'medium',
    color: commonColors.gray300,
  },
  eventCardBottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: moderateScale(10),
    backgroundColor: commonColors.primary,
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
  },
  noEventsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(50),
  },
  noEventsText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  noEventsSubText: {
    fontSize: moderateScale(14),
    textAlign: 'center',
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
  filterContainer: {
    width: moderateScale(120),
    borderRadius: moderateScale(10),
    overflow: "hidden",
    padding: moderateScale(10),
  },
  filterText: {
    fontSize: moderateScale(12),
    textAlign: "center",
  },
});

export default JoinedEvents; 