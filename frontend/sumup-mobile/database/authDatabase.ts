import AsyncStorage from '@react-native-async-storage/async-storage';

export type BriefingSettings = {
  dailyBriefing: string;
  podcastTime: string;
  notifications: string;
  podcastLength: string;
};

export type User = {
  fullName: string;
  email: string;
  password: string;
  briefingSettings: BriefingSettings;
};

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const defaultBriefingSettings: BriefingSettings = {
  dailyBriefing: 'Enabled',
  podcastTime: '07:00',
  notifications: 'Disabled',
  podcastLength: '5 min',
};

export async function getUsers(): Promise<User[]> {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);

  if (!usersJson) {
    return [];
  }

  return JSON.parse(usersJson);
}

export async function registerUser(newUser: Omit<User, 'briefingSettings'>) {
  const users = await getUsers();

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
  );

  if (emailExists) {
    return {
      success: false,
      message: 'This email is already registered.',
    };
  }

  const userWithSettings: User = {
    ...newUser,
    briefingSettings: defaultBriefingSettings,
  };

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify([...users, userWithSettings])
  );

  return {
    success: true,
    message: 'Account created successfully.',
  };
}

export async function loginUser(email: string, password: string) {
  const users = await getUsers();

  const foundUser = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (!foundUser) {
    return {
      success: false,
      message: 'Invalid email or password.',
      user: null,
    };
  }

  const normalizedUser: User = {
    ...foundUser,
    briefingSettings:
      foundUser.briefingSettings || defaultBriefingSettings,
  };

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizedUser));

  return {
    success: true,
    message: 'Signed in successfully.',
    user: normalizedUser,
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);

  if (!userJson) {
    return null;
  }

  const user = JSON.parse(userJson);

  return {
    ...user,
    briefingSettings:
      user.briefingSettings || defaultBriefingSettings,
  };
}

export async function updateCurrentUser(oldEmail: string, updatedUser: User) {
  const users = await getUsers();

  const emailUsedByAnotherUser = users.some(
    (user) =>
      user.email.toLowerCase() === updatedUser.email.toLowerCase() &&
      user.email.toLowerCase() !== oldEmail.toLowerCase()
  );

  if (emailUsedByAnotherUser) {
    return {
      success: false,
      message: 'This email is already used by another account.',
    };
  }

  const updatedUsers = users.map((user) =>
    user.email.toLowerCase() === oldEmail.toLowerCase()
      ? updatedUser
      : user
  );

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return {
    success: true,
    message: 'Profile updated successfully.',
  };
}

export async function updateBriefingSettings(
  updatedSettings: BriefingSettings
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: 'No active user found.',
    };
  }

  const updatedUser: User = {
    ...currentUser,
    briefingSettings: updatedSettings,
  };

  const users = await getUsers();

  const updatedUsers = users.map((user) =>
    user.email.toLowerCase() === currentUser.email.toLowerCase()
      ? updatedUser
      : user
  );

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return {
    success: true,
    message: 'Briefing settings updated successfully.',
  };
}

export async function logoutUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}