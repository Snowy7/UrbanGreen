import WrapperContainer from "@/components/WrapperContainer";
import { useTheme } from "@/context/ThemeContext";
import useIsRTL from "@/hooks/useIsRTL";
import { commonColors } from "@/styles/colors";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import useRTLStyles from "./styles";
import TextComp from "@/components/TextComp";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { EventsIcon, NotificationIcon, PendingRequestsIcon } from "@/assets/icons";
import { moderateScale } from "@/styles/scaling";
import { GreenspaceIcon } from "@/assets/icons";
import { useNavigation } from "@react-navigation/native";
import { AdminStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type AdminHomeNavigationProp = NativeStackNavigationProp<AdminStackParamList, "Home">;

const Home = () => {
  const isRTL = useIsRTL();
  const { theme } = useTheme();
  const styles = useRTLStyles(isRTL, theme);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigation = useNavigation<AdminHomeNavigationProp>();

  useEffect(() => {}, []);

  if (loading) {
    return (
      <WrapperContainer style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={commonColors.primary} />
      </WrapperContainer>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image source={require("@/assets/images/hero.png")} style={styles.heroImage} />
          <LinearGradient
            colors={["#8CC63F20", "#8CC63F90", "#3B903A9a", "#006837aa"]}
            locations={[0.11, 0.47, 0.75, 1]}
            style={styles.heroGradient}
          />
          <View style={styles.heroTextContainer}>
            <TextComp text={`Welcome, ${user?.firstName}`} style={styles.heroText} isDynamic />
            <TextComp
              text="Enjoy managing the green spaces in Riyadh!"
              style={styles.heroSubText}
            />
          </View>
        </View>
        <View style={styles.whiteBoard}>
          <View style={styles.sectionTitleContainer}>
            <TextComp text="What Do You Look For?" style={styles.sectionTitle} />
          </View>
          <View style={styles.twoCardsSection}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate("Greenspace")}
            >
              <GreenspaceIcon
                color={commonColors.primary}
                width={moderateScale(30)}
                height={moderateScale(30)}
              />
              <TextComp text="Manage Green Spaces" style={styles.cardTitle} />
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
              <TextComp text="Manage Events" style={styles.cardTitle} />
            </TouchableOpacity>
          </View>
          <View style={styles.twoCardsSection}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate("PendingRequests")}
            >
              <PendingRequestsIcon
                color={commonColors.primary}
                width={moderateScale(30)}
                height={moderateScale(30)}
              />
              <TextComp text="View Pending Requests" style={styles.cardTitle} />
            </TouchableOpacity>
            {/* <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate("Notifications")}
            >
              <NotificationIcon
                color={commonColors.primary}
                width={moderateScale(30)}
                height={moderateScale(30)}
              />
              <TextComp text="Send Notifications" style={styles.cardTitle} />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
