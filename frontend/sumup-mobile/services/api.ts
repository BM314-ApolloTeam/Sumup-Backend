const API_BASE_URL = 'http://10.0.2.2:5039';

export async function getWeatherData() {
  try {

    const response = await fetch(
      `${API_BASE_URL}/api/Test/weather`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return data;

  } catch (error) {

    console.error('Weather API Error:', error);

    throw error;
  }
}

export async function getGoogleData() {
  try {

    const response = await fetch(
      `${API_BASE_URL}/api/Test/google-data`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Google data');
    }

    const data = await response.json();

    return data;

  } catch (error) {

    console.error('Google API Error:', error);

    throw error;
  }
}