import axios from 'axios';
import { logger } from '../utils/logger.js';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Helper to build GitHub request headers including GITHUB_TOKEN if configured.
 */
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Repo-Explorer-Server'
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  return headers;
};

/**
 * Handle API errors, specifically identifying rate limits vs not found
 */
const handleApiError = (error, endpoint) => {
  logger.error(`GitHub API error at ${endpoint}:`, error);

  if (error.response) {
    const { status, headers } = error.response;
    
    // Check for rate limit response
    const rateLimitRemaining = headers['x-ratelimit-remaining'];
    if (status === 403 || status === 429 || rateLimitRemaining === '0') {
      const customError = new Error('GitHub API rate limit reached. Please try again later.');
      customError.status = 429;
      throw customError;
    }

    if (status === 404) {
      const customError = new Error('User not found.');
      customError.status = 404;
      throw customError;
    }

    const message = error.response.data?.message || 'Failed to fetch data from GitHub API';
    const customError = new Error(message);
    customError.status = status;
    throw customError;
  }

  // Network/Server down issues
  const networkError = new Error('GitHub API is currently unreachable. Please check your connection.');
  networkError.status = 503;
  throw networkError;
};

/**
 * Fetch GitHub profile details for a username
 * @param {string} username 
 * @returns {Promise<object>}
 */
export const fetchProfile = async (username) => {
  const url = `${GITHUB_API_BASE}/users/${username}`;
  try {
    logger.info(`Fetching GitHub profile for: ${username}`);
    const response = await axios.get(url, { headers: getHeaders() });
    return {
      avatar: response.data.avatar_url,
      name: response.data.name || response.data.login,
      username: response.data.login,
      bio: response.data.bio || 'No bio available',
      followers: response.data.followers,
      following: response.data.following,
      publicRepos: response.data.public_repos
    };
  } catch (error) {
    handleApiError(error, `/users/${username}`);
  }
};

/**
 * Fetch GitHub repositories for a username (paginated)
 * @param {string} username 
 * @param {number} page 
 * @param {number} perPage 
 * @returns {Promise<Array>}
 */
export const fetchRepositories = async (username, page = 1, perPage = 12) => {
  const url = `${GITHUB_API_BASE}/users/${username}/repos`;
  try {
    logger.info(`Fetching GitHub repos for: ${username}, Page: ${page}, Per Page: ${perPage}`);
    const response = await axios.get(url, {
      headers: getHeaders(),
      params: {
        page,
        per_page: perPage,
        sort: 'updated', // Sort by updated initially
        direction: 'desc'
      }
    });

    return response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description provided.',
      primaryLanguage: repo.language || 'Plain Text',
      starCount: repo.stargazers_count,
      lastUpdatedDate: repo.updated_at,
      openIssuesCount: repo.open_issues_count,
      forkCount: repo.forks_count,
      defaultBranch: repo.default_branch,
      repositoryUrl: repo.html_url,
      visibility: repo.private ? 'Private' : 'Public'
    }));
  } catch (error) {
    handleApiError(error, `/users/${username}/repos`);
  }
};
