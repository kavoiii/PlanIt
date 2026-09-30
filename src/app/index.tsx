import { router } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { Screen } from '../components/common/Screen';
import { colors } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

const landingIllustration = require('../../assets/images/landing_illustrations.png');

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LandingScreen() {
  // Heading animation values
  const headingOpacity = useSharedValue(0);
  const headingTranslateY = useSharedValue(20);

  // Illustration animation values
  const illustrationOpacity = useSharedValue(0);
  const illustrationTranslateY = useSharedValue(25);
  const illustrationScale = useSharedValue(0.96);

  // Button animation values
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(15);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);

    // 1. Heading enters first
    headingOpacity.value = withTiming(1, {
      duration: 500,
      easing,
    });

    headingTranslateY.value = withTiming(0, {
      duration: 500,
      easing,
    });

    // 2. Illustration enters slightly later
    illustrationOpacity.value = withDelay(
      150,
      withTiming(1, {
        duration: 650,
        easing,
      }),
    );

    illustrationTranslateY.value = withDelay(
      150,
      withTiming(0, {
        duration: 650,
        easing,
      }),
    );

    illustrationScale.value = withDelay(
      150,
      withTiming(1, {
        duration: 700,
        easing,
      }),
    );

    // 3. Button appears last
    buttonOpacity.value = withDelay(
      500,
      withTiming(1, {
        duration: 400,
        easing,
      }),
    );

    buttonTranslateY.value = withDelay(
      500,
      withTiming(0, {
        duration: 400,
        easing,
      }),
    );
  }, []);

  const headingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headingOpacity.value,
    transform: [
      {
        translateY: headingTranslateY.value,
      },
    ],
  }));

  const illustrationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: illustrationOpacity.value,
    transform: [
      {
        translateY: illustrationTranslateY.value,
      },
      {
        scale: illustrationScale.value,
      },
    ],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [
      {
        translateY: buttonTranslateY.value,
      },
      {
        scale: buttonScale.value,
      },
    ],
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.97, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    buttonScale.value = withSequence(
      withTiming(1.02, {
        duration: 100,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(1, {
        duration: 100,
        easing: Easing.out(Easing.quad),
      }),
    );
  };

  return (
    <Screen>
      <View style={styles.content}>
        <AnimatedView
          style={[styles.heading, headingAnimatedStyle]}
        >
          <Text style={styles.brand}>PlanIt</Text>

          <Text style={styles.title}>
            Your day,
            {'\n'}
            organized.
          </Text>
        </AnimatedView>

        <AnimatedView
          style={[
            styles.illustrationContainer,
            illustrationAnimatedStyle,
          ]}
        >
          <Image
            accessibilityLabel="A person planning their day with alarms, tasks, and reminders"
            resizeMode="contain"
            source={landingIllustration}
            style={styles.illustration}
          />
        </AnimatedView>

        <AnimatedPressable
          accessibilityRole="button"
          onPress={() => router.replace('/(main)')}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.button,
            buttonAnimatedStyle,
          ]}
        >
          <Text style={styles.buttonText}>
            Get Started →
          </Text>
        </AnimatedPressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
    width: '100%',
  },

  heading: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  brand: {
    ...typography.h2,
    color: colors.primary,
  },

  title: {
    ...typography.display,
    color: colors.text,
    textAlign: 'center',
  },

  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
    width: '100%',
  },

  illustration: {
    height: '100%',
    width: '100%',
  },

  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    justifyContent: 'center',
    minHeight: spacing.xxxl + spacing.xl,
    paddingHorizontal: spacing.lg,
    width: '70%',
    maxWidth: 280,
    marginBottom: spacing.xl,
  },

  buttonText: {
    ...typography.bodyMedium,
    color: colors.white,
  },
});