import * as githubService from '../services/githubService.js';
import * as cache from '../cache/githubCache.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/github/:username
 * Returns the profile information and the first page of repositories (up to 100)
 * for accurate language analytics and instant frontend sorting.
 */
export const getGitHubDetails = async (req, res, next) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    const cacheKey = `user-details-${username}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    logger.info(`Cache miss for ${username}. Fetching from GitHub API.`);
    
    // Fetch profile and up to 100 repos for initial analytics and lists
    const [profile, repositories] = await Promise.all([
      githubService.fetchProfile(username),
      githubService.fetchRepositories(username, 1, 100)
    ]);

    const responseData = {
      profile,
      repositories
    };

    // Store in cache for 60 seconds
    cache.set(cacheKey, responseData, 60);

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/github/:username/repos?page=1
 * Supports pagination for large lists of repositories (fetches 12 per page)
 */
export const getGitHubRepos = async (req, res, next) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 12;

    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    const cacheKey = `user-repos-${username}-p${page}-l${perPage}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    logger.info(`Cache miss for ${username} repos page ${page}. Fetching from GitHub API.`);
    const repositories = await githubService.fetchRepositories(username, page, perPage);

    // Cache the paginated response
    cache.set(cacheKey, repositories, 60);

    return res.status(200).json(repositories);
  } catch (error) {
    next(error);
  }
};
