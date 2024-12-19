// mweight/frontend/src/api/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/weight';

export const fetchWeightData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch API data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching API data:', error);
    return null;
  }
};
