import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/styles/colors";
import TextComp from "@/components/TextComp";
import { moderateScale, verticalScale } from "@/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { commonColors } from "@/styles/colors";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useUserProfile } from "@/hooks/useUserProfile";
import { HeartIcon } from "@/assets/icons";

interface GreenspaceCardProps {
  greenspace: {
    _id: string;
    name: string;
    description: string;
    location: string;
    entryPrice: number;
    images: string[];
  };
  onPress: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const GreenspaceCard: React.FC<GreenspaceCardProps> = ({
  greenspace,
  onPress,
  onDelete,
  onEdit,
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { userProfile } = useUserProfile();

  const isFavorited = useQuery(api.favorites.isFavorited, {
    greenSpaceId: greenspace._id as any,
    userId: userProfile?._id as any,
  });

  const toggleFavoriteMutation = useMutation(api.favorites.toggleFavorite);

  const handleToggleFavorite = async (e: any) => {
    e.stopPropagation();
    if (!userProfile?._id) return;

    try {
      await toggleFavoriteMutation({
        greenSpaceId: greenspace._id as any,
        userId: userProfile._id,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <View style={styles.shadowContainer}>
      <View style={styles.shadowWrapper}>
        <TouchableOpacity
          style={[styles.container, { backgroundColor: colors.surface }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.sideMark}></View>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: greenspace.images[0] || "https://via.placeholder.com/150" }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <TextComp
              text={greenspace.name}
              style={[styles.title, { color: commonColors.secondary }]}
            />
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <TextComp
                text={greenspace.location}
                style={[styles.location, { color: colors.textSecondary }]}
                numberOfLines={1}
              />
            </View>

            <View style={styles.actionsContainer}>
              {
                onEdit && (
                  <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                    <Ionicons name="pencil-outline" size={20} color={commonColors.primary} />
                  </TouchableOpacity>
                )
              }
              {
                onDelete && (
                  <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color={commonColors.error} />
                  </TouchableOpacity>
                )
              }
            </View>
          </View>

          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleToggleFavorite}
          >
            <HeartIcon
              color={isFavorited ? commonColors.primary : commonColors.white}
              width={moderateScale(24)}
              height={moderateScale(24)}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    marginBottom: verticalScale(10),
    marginHorizontal: moderateScale(5),
  },
  shadowWrapper: {
    shadowColor: commonColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: moderateScale(10),
  },
  container: {
    flexDirection: "row",
    borderRadius: moderateScale(10),
    overflow: "hidden",
    position: "relative",
    backgroundColor: commonColors.white,
  },
  sideMark: {
    width: moderateScale(4),
    backgroundColor: commonColors.primary,
  },
  imageContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: moderateScale(10),
  },
  favoriteButton: {
    position: "absolute",
    top: moderateScale(10),
    right: moderateScale(10),
    padding: moderateScale(4),
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: moderateScale(20),
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: moderateScale(10),
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: verticalScale(4),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  location: {
    fontSize: moderateScale(12),
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: moderateScale(8),
  },
  actionButton: {
    padding: moderateScale(4),
  },
});
