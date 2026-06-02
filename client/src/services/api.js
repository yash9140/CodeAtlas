import axios from 'axios';

// Fallback to empty string for Vite Proxy support in local dev, otherwise use env variable
const API_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch combined profile and repository details for a user
 * @param {string} username 
 * @returns {Promise<object>}
 */
export const getGitHubUser = async (username) => {
  try {
    const response = await apiClient.get(`/github/${username}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Fetch paginated repository details for a user
 * @param {string} username 
 * @param {number} page 
 * @returns {Promise<Array>}
 */
export const getGitHubRepos = async (username, page) => {
  try {
    const response = await apiClient.get(`/github/${username}/repos`, {
      params: { page, perPage: 12 },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Formats errors uniformly for the frontend UI
 */
const handleAxiosError = (error) => {
  if (error.response) {
    return new Error(error.response.data?.message || 'Failed to fetch details.');
  } else if (error.request) {
    return new Error('No response from server. Check if your backend is running.');
  } else {
    return new Error(error.message || 'An unexpected request error occurred.');
  }
};
