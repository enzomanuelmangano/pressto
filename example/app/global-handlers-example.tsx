import { createAnimatedPressable, PressablesConfig } from 'pressto';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { interpolate, interpolateColor } from 'react-native-reanimated';

// Metadata shape this screen attaches to each button.
type ButtonMeta = { name: string };

const Button = createAnimatedPressable<ButtonMeta>((progress, { metadata }) => {
  'worklet';
  return {
    transform: [{ scale: interpolate(progress, [0, 1], [1, 0.96]) }],
    backgroundColor: interpolateColor(
      progress,
      [0, 1],
      ['#1E293B', '#334155']
    ),
    borderRadius: 16,
    padding: 20,
    // metadata is available in the worklet too
    borderWidth: metadata?.name === 'silent' ? 1 : 0,
    borderColor: '#64748B',
  };
});

export default function GlobalHandlersExample() {
  const [lastGlobal, setLastGlobal] = useState('—');
  const [lastLocal, setLastLocal] = useState('—');

  return (
    // A global handler that reads each button's metadata (issue #26).
    <PressablesConfig
      metadata={{ name: 'unknown' } as ButtonMeta}
      globalHandlers={{
        onPress: ({ metadata }) => setLastGlobal(metadata?.name ?? 'unknown'),
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Global Handlers + Metadata</Text>

        <View style={styles.readout}>
          <Text style={styles.readoutLabel}>global handler saw</Text>
          <Text style={styles.readoutValue}>{lastGlobal}</Text>
          <Text style={styles.readoutLabel}>component handler saw</Text>
          <Text style={styles.readoutValue}>{lastLocal}</Text>
        </View>

        <View style={styles.section}>
          {/* metadata reaches the global handler */}
          <Button
            metadata={{ name: 'checkout' }}
            onPress={() => setLastLocal('checkout')}
          >
            <Text style={styles.buttonText}>Checkout</Text>
            <Text style={styles.hint}>global handler logs &quot;checkout&quot;</Text>
          </Button>

          <Button
            metadata={{ name: 'cancel' }}
            onPress={() => setLastLocal('cancel')}
          >
            <Text style={styles.buttonText}>Cancel</Text>
            <Text style={styles.hint}>global handler logs &quot;cancel&quot;</Text>
          </Button>

          {/* skipGlobalHandlers: the global handler does NOT fire (issue #30) */}
          <Button
            metadata={{ name: 'silent' }}
            skipGlobalHandlers
            onPress={() => setLastLocal('silent')}
          >
            <Text style={styles.buttonText}>Silent (skipGlobalHandlers)</Text>
            <Text style={styles.hint}>
              own onPress fires, global handler is skipped
            </Text>
          </Button>
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
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9',
  },
  readout: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  readoutLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  readoutValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
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
});
