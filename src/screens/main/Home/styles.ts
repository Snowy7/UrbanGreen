import { Colors, commonColors, ThemeType } from "@/styles/colors";
import fontFamily from "@/styles/fontFamily";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { StyleSheet, Dimensions } from "react-native";
import { useMemo } from "react";

const { width } = Dimensions.get("window");
const CARD_MARGIN = moderateScale(4);
const CARD_WIDTH = (width - moderateScale(20) - CARD_MARGIN * 2) / 2;

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
  const colors = Colors[theme ?? "light"];

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          paddingBottom: verticalScale(100),
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        },
        heroSection: {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
          width: "100%",
          height: verticalScale(250),
        },
        heroImage: {
          width: "100%",
          height: "100%",
        },
        heroGradient: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        heroTextContainer: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: moderateScale(20),
          marginBottom: verticalScale(30),
        },
        heroText: {
          fontSize: moderateScale(30),
          fontWeight: "bold",
          color: "#fff",
        },
        heroSubText: {
          fontSize: moderateScale(16),
          fontWeight: "200",
          color: "#fff",
        },
        content: {
          flex: 1,
          backgroundColor: colors.background,
          width: "100%",
          height: "100%",
        },
        whiteBoard: {
          flex: 1,
          backgroundColor: colors.background,
          width: "100%",
          height: "100%",
          borderTopLeftRadius: moderateScale(25),
          borderTopRightRadius: moderateScale(25),
          padding: moderateScale(20),
          marginTop: verticalScale(-25),
        },
        sectionTitle: {
          fontSize: moderateScale(16),
          fontWeight: "medium",
          color: commonColors.secondary,
          textAlign: "left",
        },
        sectionTitleContainer: {
          marginVertical: verticalScale(10),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        },
        seeAllButton: {
          alignSelf: "flex-end",
        },
        seeAllText: {
          fontSize: moderateScale(16),
          fontWeight: "medium",
          color: commonColors.gray300,
          textDecorationLine: "underline",
        },
        twoCardsSection: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: moderateScale(10),
          marginVertical: verticalScale(10),
        },
        card: {
          flex: 1,
          backgroundColor: colors.surface,
          borderRadius: moderateScale(10),
          padding: moderateScale(20),
          alignItems: "center",
          justifyContent: "center",
          gap: moderateScale(10),
          shadowColor: commonColors.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        cardTitle: {
          fontSize: moderateScale(14),
          fontWeight: "thin",
        },
        cardImage: {},
        horizontalContainer: {
          flex: 1,
          backgroundColor: colors.background,
          width: "100%",
          height: "100%",
          paddingVertical: verticalScale(10),
          paddingHorizontal: moderateScale(10),
        },
        recommendedGreenSpaceCard: {
          width: moderateScale(250),
          height: moderateScale(150),
          backgroundColor: colors.surface,
          borderRadius: moderateScale(10),
        },
        cardOverlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: moderateScale(10),
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: moderateScale(10),
        },
        recommendedGreenSpaceImage: {
          width: "100%",
          height: "100%",
          borderRadius: moderateScale(10),
        },
        recommendedGreenSpaceTitle: {
          fontSize: moderateScale(14),
          fontWeight: "medium",
          color: "#fff",
        },
        locationContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: moderateScale(5),
        },
        locationText: {
          fontSize: moderateScale(10),
          fontWeight: "medium",
          color: "#fff",
        },

        eventCardContainer: {
          width: moderateScale(250),
          backgroundColor: colors.surface,
          borderRadius: moderateScale(10),
          shadowColor: commonColors.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },

        eventCard: {
          width: "100%",
          height: "100%",
          padding: moderateScale(10),
        },

        eventCardContent: {
          flex: 1,
          paddingVertical: verticalScale(10),
          justifyContent: "flex-start",
          alignItems: "flex-start",
        },

        eventCardTitleContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: moderateScale(5),
          marginTop: verticalScale(10),
        },

        eventCardTitle: {
          fontSize: moderateScale(12),
          fontWeight: "medium",
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
          fontWeight: "medium",
          color: commonColors.gray300,
        },

        eventCardDateContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: moderateScale(5),
          marginTop: verticalScale(10),
        },

        eventCardDate: {
          fontSize: moderateScale(12),
          fontWeight: "medium",
          color: commonColors.gray300,
        },

        eventCardBottomSection: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: moderateScale(10),
          backgroundColor: commonColors.primary,
          borderBottomLeftRadius: moderateScale(10),
          borderBottomRightRadius: moderateScale(10),
        },

        bottomSection: {
          height: verticalScale(50),
          width: "100%",
        },
        noDataContainer: {
          width: moderateScale(250),
          height: moderateScale(150),
          backgroundColor: colors.surface,
          borderRadius: moderateScale(10),
          justifyContent: "center",
          alignItems: "center",
          padding: moderateScale(20),
        },
        noDataText: {
          fontSize: moderateScale(14),
          color: commonColors.gray300,
          textAlign: "center",
        },
      }),
    [isRTL, theme, colors]
  );
};

export default useRTLStyles;
