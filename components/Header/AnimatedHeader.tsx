import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    AnimatedProps,
    useAnimatedStyle,
    interpolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { styles } from '@/styles';
import { CategoriesListModal } from '../CategoriesListModal/CategoriesListModal';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface AnimatedHeaderProps {
    headerAnimatedProps: AnimatedProps<any>;
    title: string;
    scrollDirection: Animated.SharedValue<number>;
}

export function AnimatedHeader({ headerAnimatedProps, title, scrollDirection }: AnimatedHeaderProps) {
    const [showCategories, setShowCategories] = useState(false);
    const insets = useSafeAreaInsets();


    const onCategoryPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowCategories(true);
    };

    const headerTitleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        scrollDirection.value,
                        [0, 1],
                        [1, 0.96],
                        'clamp'
                    )
                }
            ]
        };
    });

    const tabsAnimatedStyle = useAnimatedStyle(() => {
        return {

            opacity: interpolate(
                scrollDirection.value,
                [0, 0.5, 1],
                [1, 0.8, 0],
                'clamp'
            ),
            transform: [
                {
                    translateY: interpolate(
                        scrollDirection.value,
                        [0, 1],
                        [0, -40],
                        'clamp'
                    )
                }
            ],
            overflow: 'hidden',
            height: interpolate(
                scrollDirection.value,
                [0, 1],
                [40, 0],
                'clamp'
            ),
        };
    });

    return (
        <>
            <Animated.View style={[styles.header]}>
                <AnimatedBlurView
                    tint="systemUltraThinMaterialDark"
                    style={[styles.blurContainer, { paddingTop: insets.top }]}
                    animatedProps={headerAnimatedProps}
                >
                    <Animated.View style={[styles.headerTitleContainer, headerTitleStyle]}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Pressable style={styles.searchButton}>
                            <Ionicons name="search" size={24} color="#fff" />
                        </Pressable>
                    </Animated.View>
                    <Animated.View style={[styles.categoryTabs, tabsAnimatedStyle]}>
                        <Pressable style={styles.categoryTab}>
                            <Text style={styles.categoryTabText}>TV Shows</Text>
                        </Pressable>
                        <Pressable style={styles.categoryTab}>
                            <Text style={styles.categoryTabText}>Movies</Text>
                        </Pressable>
                        <Pressable
                            style={styles.categoryTab}
                            onPress={onCategoryPress}
                        >
                            <Text style={styles.categoryTabTextWithIcon}>Categories</Text>
                            <Ionicons name="chevron-down" size={16} color="#fff" />
                        </Pressable>
                    </Animated.View>
                </AnimatedBlurView>
            </Animated.View>

            <CategoriesListModal
                visible={showCategories}
                onClose={() => setShowCategories(false)}
            />
        </>
    );
} 