import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 1100,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after 2.4 seconds
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  const handleSkip = () => {
    if (isAuthenticated) {
      navigation.replace('Home');
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Background Circles */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      <View style={styles.centerContent}>
        {/* Animated Brand Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconOuterRing}>
            <View style={styles.iconInnerBadge}>
              <Ionicons name="location" size={48} color={COLORS.white} />
              <View style={styles.sparkleBadge}>
                <Ionicons name="flash" size={16} color={COLORS.primary} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Brand Name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.brandTitle}>
            Near<Text style={styles.brandTitleAccent}>Serve</Text>
          </Text>

          {/* Tagline */}
          <Animated.Text style={[styles.tagline, { opacity: taglineAnim }]}>
            “Your Local Services, Just a Tap Away.”
          </Animated.Text>
        </Animated.View>

        {/* Features Pill Carousel Indicator */}
        <View style={styles.featurePillsContainer}>
          <View style={styles.featurePill}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
            <Text style={styles.featurePillText}>Verified Pros</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="time" size={14} color={COLORS.primary} />
            <Text style={styles.featurePillText}>Instant Booking</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="star" size={14} color={COLORS.primary} />
            <Text style={styles.featurePillText}>Top Rated</Text>
          </View>
        </View>
      </View>

      {/* Footer Navigation Trigger */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.versionText}>NearServe v1.0.0 • Local Service Booking</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  bgCircleTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  bgCircleBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.5,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  iconOuterRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  iconInnerBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sparkleBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  brandTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  brandTitleAccent: {
    color: COLORS.primary,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: SPACING.xs,
    lineHeight: 22,
    maxWidth: width * 0.8,
  },
  featurePillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xxl,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
    ...SHADOWS.subtle,
  },
  featurePillText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    width: '100%',
    gap: SPACING.sm,
    ...SHADOWS.button,
  },
  getStartedText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  versionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
});
