import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  getCurrentUser,
  updateCurrentUser,
  User,
} from '@/database/authDatabase';

export default function EditProfileScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        const user = await getCurrentUser();

        if (user) {
          setCurrentUser(user);
          setFullName(user.fullName);
          setEmail(user.email);
          setPassword(user.password);
        }
      }

      loadUser();
    }, [])
  );

  function handleSave() {
    if (!fullName || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'No active user found.');
      return;
    }

    Alert.alert('Update Profile', 'Do you want to save these changes?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Save',
        onPress: async () => {
          const result = await updateCurrentUser(currentUser.email, {
            ...currentUser,
            fullName,
            email,
            password,
          });

          if (!result.success) {
            Alert.alert('Update Failed', result.message);
            return;
          }

          Alert.alert('Success', result.message, [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]);
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 26,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 28,
    textAlign: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    color: '#111827',
  },

  saveButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 12,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});