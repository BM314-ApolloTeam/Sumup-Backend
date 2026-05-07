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

import { registerUser } from '@/database/authDatabase';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    if (!fullName || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters.'
      );
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

    Alert.alert(
      'Account Created',
      'Your account has been created successfully.',
      [
        {
          text: 'Continue',
          onPress: () => router.replace('/welcome/sign-in'),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

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

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Already have an account? </Text>

        <Pressable onPress={() => router.push('/welcome/sign-in')}>
          <Text style={styles.linkText}>Sign In</Text>
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