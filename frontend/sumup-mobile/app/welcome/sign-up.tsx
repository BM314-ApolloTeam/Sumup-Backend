import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { useState } from 'react';

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import { loginWithGoogle, registerUser } from '@/database/authDatabase';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    if (!fullName || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    const result = await registerUser({
      fullName,
      email,
      password,
    });

    if (!result.success) {
      Alert.alert('Sign Up Failed', result.message);
      return;
    }

    router.replace('/(tabs)');
  }

  async function handleGoogleSignIn() {
    try {
      const redirectUri = Linking.createURL('google-auth-success', {
        scheme: 'sumupmobile',
      });

      const loginUrl =
        `https://helpful-radiation-creation.ngrok-free.dev/api/google-auth/login?appRedirectUri=${encodeURIComponent(
          redirectUri
        )}`;

      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        redirectUri
      );

      if (result.type !== 'success') {
        Alert.alert(
          'Google Connection',
          'Google connection was cancelled or could not be completed.'
        );
        return;
      }

      const url = new URL(result.url);

      const googleEmail = url.searchParams.get('email');
      const googleName = url.searchParams.get('name');
      const accessToken = url.searchParams.get('access_token');

      if (!googleEmail || !accessToken) {
        Alert.alert(
          'Google Sign Up Failed',
          'Google account information could not be received.'
        );
        return;
      }

      const loginResult = await loginWithGoogle({
        fullName: googleName || 'Google User',
        email: googleEmail,
        googleAccessToken: accessToken,
      });

      if (!loginResult.success) {
        Alert.alert('Google Sign Up Failed', loginResult.message);
        return;
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.log('Google Sign Up Error:', error);

      Alert.alert(
        'Google Sign Up Failed',
        'An error occurred while signing up with Google.'
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.orangeCircle} />
      <View style={styles.pinkCircle} />
      <View style={styles.purpleCircle} />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>JOIN SUMUP</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Build your personalized AI podcast briefing experience.
        </Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.45)"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>

          <Pressable onPress={() => router.push('/welcome/sign-in')}>
            <Text style={styles.linkText}>Sign In</Text>
          </Pressable>
        </View>
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
    top: -80,
    right: -50,
  },

  pinkCircle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FF006E',
    opacity: 0.18,
    bottom: -70,
    left: -60,
  },

  purpleCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#8338EC',
    opacity: 0.2,
    top: 220,
    left: -70,
  },

  backButton: {
    position: 'absolute',
    top: 58,
    left: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  content: {
    alignItems: 'center',
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 24,
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
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },

  formCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    fontSize: 15,
    color: '#FFFFFF',
  },

  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF7A00',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
  },

  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },

  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.5,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 26,
  },

  bottomText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.62)',
  },

  linkText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FF7A00',
  },
});