import WrapperContainer from "@/components/WrapperContainer";
import { useTheme } from "@/context/ThemeContext";
import useIsRTL from "@/hooks/useIsRTL";
import { commonColors } from "@/styles/colors";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import useRTLStyles from "./styles";
import TextComp from "@/components/TextComp";
import { moderateScale } from "@/styles/scaling";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";
import WeatherComp from "@/components/WeatherComp";
import { CalendarIcon, ClockIcon, EventsIcon, GreenspaceIcon, LocationIcon } from "@/assets/icons";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type MainHomeNavigationProp = NativeStackNavigationProp<MainStackParamList, "Home">;

const Home = () => {
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigation = useNavigation<MainHomeNavigationProp>();

  // Fetch green spaces and events
  const greenSpaces = useQuery(api.greenspaces.getAll) || [];
  const events = useQuery(api.events.getAll) || [];

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

  useEffect(() => {
    setLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <WrapperContainer style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={commonColors.primary} />
      </WrapperContainer>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image source={require("@/assets/images/hero.png")} style={styles.heroImage} />
        <LinearGradient
          colors={["#8CC63F20", "#8CC63F90", "#3B903A9a", "#006837aa"]}
          locations={[0.11, 0.47, 0.75, 1]}
          style={styles.heroGradient}
        />
        <View style={styles.heroTextContainer}>
          <TextComp text={`Welcome, ${user?.firstName}`} style={styles.heroText} isDynamic />
          <TextComp text="Enjoy exploring green Riyadh!" style={styles.heroSubText} />
        </View>
      </View>
      <View style={styles.whiteBoard}>
        {/* Weather Section */}
        <WeatherComp />

        {/* Two cards section */}
        <View style={styles.sectionTitleContainer}>
          <TextComp text="What Do You Look For?" style={styles.sectionTitle} />
        </View>
        <View style={styles.twoCardsSection}>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate("GreenSpaces")}
          >
            <GreenspaceIcon
              color={commonColors.primary}
              width={moderateScale(30)}
              height={moderateScale(30)}
            />
            <TextComp text="Greenspaces" style={styles.cardTitle} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate("Events")}
          >
            <EventsIcon
              color={commonColors.primary}
              width={moderateScale(30)}
              height={moderateScale(30)}
            />
            <TextComp text="Events" style={styles.cardTitle} />
          </TouchableOpacity>
        </View>

        {/* Recommended Greenspaces Section */}
        <View style={styles.sectionTitleContainer}>
          <TextComp text="Recommended For You" style={styles.sectionTitle} />
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate("GreenSpaces")}
          >
            <TextComp text="See All" style={styles.seeAllText} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.horizontalContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: moderateScale(10) }}
        >
          {greenSpaces.length > 0 ? (
            greenSpaces.slice(0, 3).map((greenSpace, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.recommendedGreenSpaceCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate("GreenSpaceDetails", { id: greenSpace._id })}
              >
                <Image
                  source={{ uri: greenSpace.images[0] || require("@/assets/images/hero.png") }}
                  style={styles.recommendedGreenSpaceImage}
                />
                <LinearGradient
                  colors={["#8CC63F20", "#8CC63F5a", "#3B903Aa5", "#006837aa"]}
                  locations={[0.11, 0.47, 0.75, 1]}
                  style={styles.cardOverlay}
                >
                  <TextComp text={greenSpace.name} style={styles.recommendedGreenSpaceTitle} />
                  <View style={styles.locationContainer}>
                    <LocationIcon
                      color={commonColors.white}
                      width={moderateScale(15)}
                      height={moderateScale(15)}
                    />
                    <TextComp text={greenSpace.location} style={styles.locationText} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <TextComp text="No green spaces available" style={styles.noDataText} />
            </View>
          )}
        </ScrollView>

        {/* Recent Events Section */}
        <View style={styles.sectionTitleContainer}>
          <TextComp text="Recently Added Events" style={styles.sectionTitle} />
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate("Events")}
          >
            <TextComp text="See All" style={styles.seeAllText} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.horizontalContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: moderateScale(10) }}
        >
          {events.length > 0 ? (
            events.slice(0, 3).map((event, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.eventCardContainer} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate("EventDetails", { id: event._id })}
              >
                <View style={styles.eventCard}>
                  <View style={styles.eventCardTitleContainer}>
                    <View style={styles.dot} />
                    <TextComp text={event.category} style={styles.eventCardTitle} />
                  </View>
                  <View style={styles.eventCardContent}>
                    <TextComp text={event.name} style={styles.eventCardTitle} />
                    <TextComp text={event.description} style={styles.eventCardDescription} />
                    <View style={styles.eventCardDateContainer}>
                      <CalendarIcon
                        color={commonColors.primary}
                        width={moderateScale(15)}
                        height={moderateScale(15)}
                      />
                      <TextComp text={formatDate(event.date)} style={styles.eventCardDate} />
                      <ClockIcon
                        color={commonColors.primary}
                        width={moderateScale(15)}
                        height={moderateScale(15)}
                      />
                      <TextComp
                        text={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                        style={styles.eventCardDate}
                      />
                    </View>
                  </View>
                  <View style={styles.eventCardBottomSection}></View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <TextComp text="No events available" style={styles.noDataText} />
            </View>
          )}
        </ScrollView>
        {/* Bottom Section to push the content up */}
        <View style={styles.bottomSection}></View>
      </View>
    </ScrollView>
  );
};

export default Home;
