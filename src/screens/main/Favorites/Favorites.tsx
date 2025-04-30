import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
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
import { GreenspaceCard } from '@/components/GreenspaceCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import LoadingComp from '@/components/LoadingComp';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Favorites'>;

const Favorites = () => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const navigation = useNavigation<NavigationProp>();
  const { userProfile } = useUserProfile();
  const [refreshing, setRefreshing] = useState(false);

  const favorites = useQuery(api.favorites.getFavorites, {
    userId: userProfile?._id as any,
  });

  console.log('User Profile:', userProfile);
  console.log('Favorites:', favorites);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // The query will automatically refetch when the component re-renders
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderNoFavorites = () => (
    <View style={styles.noFavoritesContainer}>
      <Ionicons name="heart-outline" size={48} color={colors.textSecondary} />
      <TextComp text="No Favorites Yet" style={[styles.noFavoritesText, { color: colors.text }]} />
      <TextComp 
        text="You haven't added any green spaces to your favorites yet." 
        style={[styles.noFavoritesSubText, { color: colors.textSecondary }]} 
      />
    </View>
  );

  if (!favorites) {
    return <LoadingComp message="Loading favorites..." />;
  }

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
            <TextComp text="Favorites" style={styles.heroText} />
          </View>
        </View>

        <View style={styles.whiteBoard}>
          <View style={styles.searchContainer}>
            <TextComp text="All Favorites" style={styles.allText} />
            <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
            </View>
          </View>

          <FlatList
            data={favorites}
            renderItem={({ item }) => (
              <GreenspaceCard
                greenspace={item}
                onPress={() => navigation.navigate('GreenSpaceDetails', { id: item._id })}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderNoFavorites}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[commonColors.primary]}
                tintColor={commonColors.primary}
              />
            }
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
  noFavoritesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(50),
  },
  noFavoritesText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  noFavoritesSubText: {
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

export default Favorites; 