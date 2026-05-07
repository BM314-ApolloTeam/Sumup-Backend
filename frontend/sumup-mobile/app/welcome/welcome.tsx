import { Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>
          Podcast Briefing
        </Text>

        <Text style={styles.description}>
          Personalized daily podcast summaries generated from your connected
          data sources.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/welcome/sign-in')}
        >
          <Text style={styles.primaryButtonText}>
            Sign In
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/welcome/sign-up')}
        >
          <Text style={styles.secondaryButtonText}>
            Sign Up
          </Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  content: {
    alignItems: 'center',
  },

  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
    textAlign: 'center',
  },

  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: 40,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 14,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});