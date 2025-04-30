//import liraries
import ModalComp from '@/components/ModalComp';
import TextComp from '@/components/TextComp';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import { Colors, commonColors, ThemeType } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';


// create a component
const MyTabBar = ({ state, descriptors, navigation }) => {
    const isRTL = useIsRTL();
    const { theme } = useTheme();
    const styles = useRTLStyles(isRTL, theme);
    const colors = Colors[theme];

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {state?.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key
                        });
                    };

                    const icon = options.tabBarIcon
                        ? options.tabBarIcon({
                            focused: isFocused,
                            color: isFocused ? '#8CC63F' : colors.textSecondary,
                        })
                        : null;

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabButton}
                        >
                            {icon}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

// define your styles

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        wrapper: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            paddingHorizontal: moderateScale(16),
            paddingBottom: moderateScale(16),
        },
        container: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            backgroundColor: colors.background,
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScale(4),
            borderRadius: moderateScale(100),
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
        },
        tabButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: moderateScale(4),
        },
        label: {
            fontSize: moderateScale(12),
            marginTop: moderateScale(4),
        },
    });
};

//make this component available to the app
export default React.memo(MyTabBar);
