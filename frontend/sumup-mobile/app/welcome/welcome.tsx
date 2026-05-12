import { Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>

      {/* Decorative background shapes */}
      <View style={styles.orangeCircle} />
      <View style={styles.pinkCircle} />
      <View style={styles.purpleCircle} />

      <View style={styles.content}>

        {/* App badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            SUMUP AI
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Podcast Briefing
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Personalized AI-powered podcast summaries built from your calendar,
          weather, and daily activities.
        </Text>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Smart. Fast. Personalized.
          </Text>

          <Text style={styles.cardText}>
            Get intelligent audio briefings designed specifically for your day
            and productivity flow.
          </Text>
        </View>

        {/* Sign In */}
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/welcome/sign-in')}
        >
          <Text style={styles.primaryButtonText}>
            Sign In
          </Text>
        </Pressable>

        {/* Sign Up */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/welcome/sign-up')}
        >
          <Text style={styles.secondaryButtonText}>
            Create Account
          </Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    paddingHorizontal: 28,
    overflow: 'hidden',
  },

  orangeCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#FF7A00',
    opacity: 0.22,
    top: -70,
    right: -40,
  },

  pinkCircle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FF006E',
    opacity: 0.18,
    bottom: -60,
    left: -50,
  },

  purpleCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#8338EC',
    opacity: 0.2,
    top: 240,
    left: -60,
  },

  content: {
    alignItems: 'center',
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },

  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 18,
  },

  description: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 38,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 28,
    padding: 24,
    marginBottom: 38,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },

  cardText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 24,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#FF7A00',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF7A00',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  secondaryButton: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});