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
        },
        emptyContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: verticalScale(32),
        },

        emptyText: {
          textAlign: "center",
        },
        addGreenspaceButton: {
          // center horizontally, 80 from bottom
          position: "absolute",
          bottom: verticalScale(80),
          alignSelf: "center",
          backgroundColor: commonColors.primary,
          padding: moderateScale(10),
          borderRadius: moderateScale(100),
          flexDirection: "row",
          alignItems: "center",
          gap: moderateScale(10),
        },

        addGreenspaceText: {
          fontSize: moderateScale(16),
          fontWeight: "medium",
          color: commonColors.white,
        },

        backArrow: {
          position: "absolute",
          top: verticalScale(40),
          left: moderateScale(15),
          padding: moderateScale(10),
          backgroundColor: "#ffffff55",
          borderRadius: moderateScale(100),
        },
        content: {
          flex: 1,
          height: "100%",
          width: "100%",
          minHeight: "100%",
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
          height: "25%",
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
          fontSize: moderateScale(14),
          fontWeight: "200",
          color: "#fff",
        },
        whiteBoard: {
          width: "100%",
          height: "80%",
          maxWidth: moderateScale(400),
          backgroundColor: commonColors.white,
          borderTopLeftRadius: moderateScale(25),
          borderTopRightRadius: moderateScale(25),
          padding: moderateScale(20),
          marginTop: verticalScale(-25),
          shadowColor: commonColors.black,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
        listContainer: {
          flex: 1,
          backgroundColor: colors.background,
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
          fontSize: moderateScale(10),
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
        formContainer: {
          flex: 1,
        },
        inputsContainer: {
          marginBottom: verticalScale(16),
        },
        horizontalInputsContainer: {
          flexDirection: "row",
          marginBottom: verticalScale(16),
        },
        inputContainer: {
          backgroundColor: colors.inputBackground,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: moderateScale(8),
          paddingHorizontal: moderateScale(12),
          paddingVertical: verticalScale(8),
          minHeight: verticalScale(40),
          justifyContent: "center",
        },
        input: {
          fontSize: moderateScale(14),
          fontFamily: fontFamily.regular,
          color: colors.text,
          minHeight: verticalScale(24),
          width: "100%",
          textAlignVertical: "center",
          lineHeight: verticalScale(24),
        },
        timeInput: {
          width: "100%",
          //center vertically
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        },
        inputLabel: {
          fontSize: moderateScale(12),
          fontFamily: fontFamily.medium,
          color: commonColors.secondary,
          marginBottom: verticalScale(4),
        },
        descriptionInput: {
          minHeight: verticalScale(120),
          textAlignVertical: "top",
          paddingTop: verticalScale(8),
        },
        descriptionContainer: {
          minHeight: verticalScale(120),
        },
        imageUploadButton: {
          width: moderateScale(100),
          height: moderateScale(100),
          justifyContent: "center",
          alignItems: "center",
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: commonColors.secondary,
        },
        imageUploadText: {
          color: commonColors.secondary,
          fontSize: moderateScale(12),
          fontFamily: fontFamily.medium,
          marginTop: moderateScale(4),
        },
        submitButton: {
          marginTop: verticalScale(24),
          marginBottom: verticalScale(32),
        },
        imagesContainer: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: moderateScale(8),
        },
        imageWrapper: {
          position: "relative",
          width: moderateScale(100),
          height: moderateScale(100),
        },
        thumbnail: {
          width: "100%",
          height: "100%",
          borderRadius: moderateScale(8),
        },
        removeImageButton: {
          position: "absolute",
          top: -moderateScale(8),
          right: -moderateScale(8),
          backgroundColor: colors.surface,
          borderRadius: moderateScale(12),
        },
        pickerContainer: {
          padding: 0,
          height: verticalScale(50),
          justifyContent: "center",
        },
        picker: {
          height: verticalScale(50),
          width: "100%",
          color: colors.text,
        },
        selectedDaysContainer: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: moderateScale(8),
          marginTop: verticalScale(8),
        },
        selectedDayTag: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: commonColors.primary,
          paddingHorizontal: moderateScale(8),
          paddingVertical: moderateScale(4),
          borderRadius: moderateScale(4),
          gap: moderateScale(4),
        },
        selectedDayText: {
          color: commonColors.white,
          fontSize: moderateScale(12),
        },
        removeDayButton: {
          padding: moderateScale(2),
        },
        timeInputContainer: {
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        },
        timeIcon: {
          marginRight: moderateScale(8),
        },
        imagesGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: moderateScale(8),
        },
        imageItem: {
          position: "relative",
          width: moderateScale(100),
          height: moderateScale(100),
        },
        imagePreview: {
          width: "100%",
          height: "100%",
          borderRadius: moderateScale(8),
        },
        removeButton: {
          position: "absolute",
          top: -moderateScale(8),
          right: -moderateScale(8),
          backgroundColor: colors.surface,
          borderRadius: moderateScale(12),
        },
      }),
    [isRTL, theme, colors]
  );
};

export default useRTLStyles;
