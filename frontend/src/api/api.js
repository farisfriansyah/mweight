// mweight/frontend/src/api/api.js
const API_WEIGHT_URL = process.env.REACT_APP_API_WEIGHT_URL || 'http://10.88.67.70:3001/api/weight';
const API_WEIGHT_HISTORY_URL = process.env.REACT_APP_API_WEIGHT_HISTORY_URL || 'http://10.88.67.70:3001/api/weight-history';

export const fetchWeightData = async () => {
  try {
    const response = await fetch(API_WEIGHT_URL);
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

export const fetchWeightHistoryData = async () => {
  try {
    const response = await fetch(API_WEIGHT_HISTORY_URL);
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
