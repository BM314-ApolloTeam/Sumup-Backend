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
  googleAccessToken?: string;
};

type GoogleLoginPayload = {
  fullName: string;
  email: string;
  googleAccessToken: string;
};

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const defaultBriefingSettings: BriefingSettings = {
  dailyBriefing: 'Enabled',
  podcastTime: '07:00',
  notifications: 'Disabled',
  podcastLength: '5 min',
};

function normalizeUser(user: User): User {
  return {
    ...user,
    briefingSettings: {
      ...defaultBriefingSettings,
      ...(user.briefingSettings || {}),
    },
    googleAccessToken: user.googleAccessToken,
  };
}

export async function getUsers(): Promise<User[]> {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);

    if (!usersJson) {
      return [];
    }

    const users = JSON.parse(usersJson);

    if (!Array.isArray(users)) {
      return [];
    }

    return users.map(normalizeUser);
  } catch (error) {
    console.log('Get users error:', error);
    return [];
  }
}

export async function registerUser(
  newUser: Omit<User, 'briefingSettings' | 'googleAccessToken'>
) {
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
    googleAccessToken: undefined,
  };

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify([...users, userWithSettings])
  );

  await AsyncStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(userWithSettings)
  );

  console.log('Saved Current User:', userWithSettings);

  return {
    success: true,
    message: 'Account created successfully.',
    user: userWithSettings,
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

  const normalizedUser = normalizeUser(foundUser);

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizedUser));

  console.log('Logged User:', normalizedUser);

  return {
    success: true,
    message: 'Signed in successfully.',
    user: normalizedUser,
  };
}

export async function loginWithGoogle(googleUser: GoogleLoginPayload) {
  try {
    const users = await getUsers();

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === googleUser.email.toLowerCase()
    );

    let updatedUser: User;

    if (existingUser) {
      updatedUser = normalizeUser({
        ...existingUser,
        fullName: googleUser.fullName || existingUser.fullName,
        googleAccessToken: googleUser.googleAccessToken,
      });

      const updatedUsers = users.map((user) =>
        user.email.toLowerCase() === googleUser.email.toLowerCase()
          ? updatedUser
          : user
      );

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    } else {
      updatedUser = {
        fullName: googleUser.fullName || 'Google User',
        email: googleUser.email,
        password: '',
        briefingSettings: defaultBriefingSettings,
        googleAccessToken: googleUser.googleAccessToken,
      };

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify([...users, updatedUser])
      );
    }

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    console.log('Google Logged User:', updatedUser);

    return {
      success: true,
      message: 'Signed in with Google successfully.',
      user: updatedUser,
    };
  } catch (error) {
    console.log('Google login database error:', error);

    return {
      success: false,
      message: 'Google user could not be saved.',
      user: null,
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);

    if (!userJson) {
      return null;
    }

    const user = JSON.parse(userJson);

    return normalizeUser(user);
  } catch (error) {
    console.log('Get current user error:', error);
    return null;
  }
}

export async function updateCurrentUser(oldEmail: string, updatedUser: User) {
  const users = await getUsers();

  const normalizedUpdatedUser = normalizeUser(updatedUser);

  const emailUsedByAnotherUser = users.some(
    (user) =>
      user.email.toLowerCase() === normalizedUpdatedUser.email.toLowerCase() &&
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
      ? normalizedUpdatedUser
      : user
  );

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

  await AsyncStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(normalizedUpdatedUser)
  );

  return {
    success: true,
    message: 'Profile updated successfully.',
    user: normalizedUpdatedUser,
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
    briefingSettings: {
      ...defaultBriefingSettings,
      ...updatedSettings,
    },
    googleAccessToken: currentUser.googleAccessToken,
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
    user: updatedUser,
  };
}

export async function logoutUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}