import { createAnimatedPressable, PressablesConfig } from 'pressto';
import { StyleSheet, Text, View } from 'react-native';
import { interpolate, interpolateColor } from 'react-native-reanimated';

// Define your app's theme/design system
type AppTheme = {
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;
    background: string;
    text: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
};

const theme: AppTheme = {
  colors: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    secondary: '#EC4899',
    secondaryDark: '#DB2777',
    background: '#0F172A',
    text: '#F1F5F9',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
};

// Create themed pressable that uses metadata from context
const ThemedPrimaryButton = createAnimatedPressable<AppTheme>(
  (progress, { isPressed, isToggled, metadata }) => {
    'worklet';

    const scale = interpolate(progress, [0, 1], [1, 0.96]);

    const backgroundColor = interpolateColor(
      progress,
      [0, 1],
      [metadata.colors.primary, metadata.colors.primaryDark]
    );

    // Subtle elevation effect when toggled
    const shadowOpacity = isToggled ? 0.3 : 0.15;

    return {
      transform: [{ scale }],
      backgroundColor,
      borderRadius: metadata.borderRadius.medium,
      padding: metadata.spacing.medium,
      // Dim when pressed
      opacity: isPressed ? 0.9 : 1,
      shadowOpacity,
      shadowRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
    };
  }
);

const ThemedSecondaryButton = createAnimatedPressable<AppTheme>(
  (progress, { isToggled, metadata }) => {
    'worklet';

    const scale = interpolate(progress, [0, 1], [1, 0.94]);

    // Toggle between secondary colors
    const backgroundColor = isToggled
      ? metadata.colors.secondary
      : metadata.colors.secondaryDark;

    // Rotate slightly when toggled
    const rotate = isToggled ? '3deg' : '0deg';

    return {
      transform: [{ scale }, { rotate }],
      backgroundColor,
      borderRadius: metadata.borderRadius.large,
      padding: metadata.spacing.large,
    };
  }
);

const ThemedCard = createAnimatedPressable<AppTheme>(
  (progress, { isFocused, metadata }) => {
    'worklet';

    const scale = interpolate(progress, [0, 1], [1, 0.98]);

    return {
      transform: [{ scale }],
      backgroundColor: metadata.colors.background,
      borderRadius: metadata.borderRadius.large,
      padding: metadata.spacing.large,
      borderWidth: isFocused ? 2 : 1,
      borderColor: isFocused
        ? metadata.colors.primary
        : metadata.colors.primaryDark,
    };
  }
);

export default function MetadataExample() {
  return (
    // Pass your theme as metadata - it will be available in all pressables!
    <PressablesConfig metadata={theme}>
      <View style={styles.container}>
        <Text style={styles.title}>Metadata Theme Example</Text>
        <Text style={styles.subtitle}>
          All buttons access theme values from PressablesConfig metadata
        </Text>

        <View style={styles.section}>
          <ThemedPrimaryButton onPress={() => console.log('primary')}>
            <Text style={styles.buttonText}>Primary Button</Text>
            <Text style={styles.hint}>Uses theme.colors.primary</Text>
          </ThemedPrimaryButton>

          <ThemedSecondaryButton onPress={() => console.log('secondary')}>
            <Text style={styles.buttonText}>Secondary (Toggle)</Text>
            <Text style={styles.hint}>
              Toggles between theme secondary colors
            </Text>
          </ThemedSecondaryButton>

          <ThemedCard onPress={() => console.log('card 1')}>
            <Text style={styles.cardText}>Themed Card 1</Text>
            <Text style={styles.hint}>Focuses with primary border</Text>
          </ThemedCard>

          <ThemedCard onPress={() => console.log('card 2')}>
            <Text style={styles.cardText}>Themed Card 2</Text>
            <Text style={styles.hint}>Last pressed shows border</Text>
          </ThemedCard>
        </View>
      </View>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F172A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
  },
  section: {
    gap: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#F1F5F9',
    fontWeight: '600',
  },
});
