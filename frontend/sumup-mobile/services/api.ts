const API_BASE_URL = 'http://10.0.2.2:5039';

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
    const response = await fetch(`${API_BASE_URL}/api/Test/google-data`);

    if (!response.ok) {
      throw new Error('Failed to fetch Google data');
    }

    const data = await response.json();

    return data;
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