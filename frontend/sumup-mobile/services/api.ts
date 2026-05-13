import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.137.17:5039';

let weatherErrorLogged = false;
let googleErrorLogged = false;

export async function getWeatherData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Test/weather`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (!weatherErrorLogged) {
      console.log('Weather API Error:', error);
      weatherErrorLogged = true;
    }

    return {
      success: false,
      message: 'Weather service is not connected yet.',
    };
  }
}

export async function getGoogleData() {
  try {
    const currentUserJson = await AsyncStorage.getItem('currentUser');

    if (!currentUserJson) {
      return {
        success: false,
        message: 'Google Calendar and Tasks are not connected yet.',
      };
    }

    const currentUser = JSON.parse(currentUserJson);

    if (!currentUser.googleAccessToken) {
      return {
        success: false,
        message: 'Google Calendar and Tasks are not connected yet.',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/Test/google-data`, {
      headers: {
        Authorization: `Bearer ${currentUser.googleAccessToken}`,
      },
    });

    const data = await response.json();

    console.log('Google Response:', data);

    if (!response.ok || data?.success === false) {
      return {
        success: false,
        message: data?.message || 'Google Calendar and Tasks are not connected yet.',
        error: data?.error,
        innerError: data?.innerError,
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    if (!googleErrorLogged) {
      console.log('Google API Error:', error);
      googleErrorLogged = true;
    }

    return {
      success: false,
      message: 'Google Calendar and Tasks are not connected yet.',
    };
  }
}