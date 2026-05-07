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

import { loginUser } from '@/database/authDatabase';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      Alert.alert('Sign In Failed', result.message);
      return;
    }

    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Sign In</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <Pressable style={[styles.googleButton, styles.disabledButton]} disabled>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Don't have an account? </Text>

        <Pressable onPress={() => router.push('/welcome/sign-up')}>
          <Text style={styles.linkText}>Sign Up</Text>
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

  backButton: {
    position: 'absolute',
    top: 58,
    left: 24,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 34,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    color: '#111827',
  },

  button: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },

  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
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
    marginTop: 24,
  },

  bottomText: {
    fontSize: 14,
    color: '#6B7280',
  },

  linkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
});