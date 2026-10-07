import { Profiler, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { createAnimatedPressable, PressableScale } from 'pressto';
import { BaseButton } from 'react-native-gesture-handler';
import { interpolate, makeMutable } from 'react-native-reanimated';

// Benchmark screen (development tool, uses only pressto's public API so the
// same screen measures any implementation). Results are logged as
// `BENCH {json}` and also POSTed to http://127.0.0.1:8099 when a collector
// listens there (simulator / `adb reverse`).
//
// 1. Mount: time to mount N PressableScale (setState -> second frame),
//    interleaved with BaseButton and View; median and min of RUNS.
// 2. Worklet runs per press: counters incremented by animatedStyle worklets on
//    the UI thread; press "target" and "target-b" alternately (each press
//    changes the last touched pressable, as in an app) and read them back.
// 3. Press feedback while the JS thread is blocked: press "arm", then press
//    "feedback" while JS is busy; the UI thread records when the press
//    animation started.

const COUNTS = [50, 200, 500];
// PressableScale, and for reference the RNGH button it wraps and plain views.
const KINDS = ['PressableScale', 'BaseButton', 'View'] as const;
type MountKind = (typeof KINDS)[number];
const RUNS = 9;
const GRID = 200;

const log = (o: object) => {
  console.log('BENCH ' + JSON.stringify(o));
  fetch('http://127.0.0.1:8099', {
    method: 'POST',
    body: JSON.stringify(o),
  }).catch(() => {});
};
const median = (xs: number[]) =>
  [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]!;
// `performance` is available in React Native but not in this tsconfig's lib.
const now = (): number =>
  (globalThis as { performance?: { now(): number } }).performance?.now() ??
  Date.now();
const nextFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));

// UI-thread counters.
const targetRuns = makeMutable(0);
const otherRuns = makeMutable(0);
const feedbackAt = makeMutable(0);
// JS-side count of onPressIn calls for the last press of a target.
let pressInCalls = 0;

const CountedOther = createAnimatedPressable((progress) => {
  'worklet';
  otherRuns.set(otherRuns.get() + 1);
  return { transform: [{ scale: interpolate(progress, [0, 1], [1, 0.96]) }] };
});

const CountedTarget = createAnimatedPressable((progress) => {
  'worklet';
  targetRuns.set(targetRuns.get() + 1);
  return { transform: [{ scale: interpolate(progress, [0, 1], [1, 0.96]) }] };
});

const FeedbackTarget = createAnimatedPressable((progress) => {
  'worklet';
  if (progress > 0 && feedbackAt.get() === 0) {
    feedbackAt.set(Date.now());
  }
  return { opacity: interpolate(progress, [0, 1], [1, 0.4]) };
});

const busyWait = (ms: number) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // block the JS thread
  }
};

export default function Bench() {
  const [phase, setPhase] = useState<'mount' | 'interact'>('mount');
  const [mount, setMount] = useState<{
    n: number;
    key: number;
    kind: MountKind;
  } | null>(null);
  const [status, setStatus] = useState('starting');
  const busy = useRef({ start: 0, end: 0 });

  useEffect(() => {
    (async () => {
      await nextFrame();
      // Kinds are interleaved within each run so drift affects them equally.
      for (const n of COUNTS) {
        const times: Record<string, number[]> = {};
        for (let r = 0; r < RUNS; r++) {
          for (const kind of KINDS) {
            setMount(null);
            await nextFrame();
            await nextFrame();
            const t = now();
            setMount({ n, key: r, kind });
            await nextFrame();
            await nextFrame();
            (times[kind] ??= []).push(now() - t);
          }
        }
        for (const kind of KINDS) {
          log({
            kind: 'mount',
            component: kind,
            n,
            ms: median(times[kind]!),
            min: Math.min(...times[kind]!),
          });
        }
        setStatus(`mounted ${n}`);
      }
      setMount(null);
      targetRuns.set(0);
      otherRuns.set(0);
      setPhase('interact');
      setStatus('ready');
    })();
  }, []);

  if (phase === 'mount') {
    return (
      <View style={styles.root}>
        <Text style={styles.status}>{status}</Text>
        <Profiler id="mount" onRender={() => {}}>
          <View style={styles.grid}>
            {mount &&
              Array.from({ length: mount.n }, (_, i) => {
                const key = `${mount.key}-${i}`;
                if (mount.kind === 'BaseButton') {
                  return <BaseButton key={key} style={styles.cell} />;
                }
                if (mount.kind === 'View') {
                  return <View key={key} style={styles.cell} />;
                }
                return <PressableScale key={key} style={styles.cell} />;
              })}
          </View>
        </Profiler>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.status} testID="bench-status" numberOfLines={3}>
        {status}
      </Text>
      <View style={styles.row}>
        {['target', 'target-b'].map((id) => (
          <CountedTarget
            key={id}
            testID={id}
            style={styles.button}
            onPressIn={() => {
              pressInCalls++;
            }}
            onPress={() => {
              setTimeout(() => {
                log({
                  kind: 'runs-per-press',
                  n: GRID,
                  target: targetRuns.get(),
                  others: otherRuns.get(),
                  pressInCalls,
                });
                pressInCalls = 0;
                setStatus(
                  `runs: target ${targetRuns.get()} / others ${otherRuns.get()}`
                );
                targetRuns.set(0);
                otherRuns.set(0);
              }, 1500);
            }}
          >
            <Text style={styles.label}>{id}</Text>
          </CountedTarget>
        ))}
      </View>
      <View style={styles.row}>
        <PressableScale
          testID="arm"
          style={styles.button}
          onPress={() => {
            feedbackAt.set(0);
            setStatus('armed: press feedback now');
            setTimeout(() => {
              busy.current.start = Date.now();
              busyWait(1500);
              busy.current.end = Date.now();
              setTimeout(() => {
                const at = feedbackAt.get();
                const result = {
                  kind: 'feedback-while-js-blocked',
                  busyMs: busy.current.end - busy.current.start,
                  feedbackDuringBusy:
                    at > 0 && at < busy.current.end ? true : false,
                  feedbackAfterBusyEndMs: at > 0 ? at - busy.current.end : null,
                };
                log(result);
                setStatus(JSON.stringify(result));
              }, 1000);
            }, 300);
          }}
        >
          <Text style={styles.label}>arm</Text>
        </PressableScale>
        <FeedbackTarget testID="feedback" style={styles.button}>
          <Text style={styles.label}>feedback</Text>
        </FeedbackTarget>
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {Array.from({ length: GRID }, (_, i) => (
          <CountedOther key={i} style={styles.cell} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  status: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    height: 54,
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  button: {
    width: 110,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#2f7cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: '#fff', fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    padding: 8,
    justifyContent: 'center',
  },
  cell: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#333' },
});
