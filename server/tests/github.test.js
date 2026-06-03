import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import * as githubService from '../services/githubService.js';
import cache from '../cache/githubCache.js';

// Mock the githubService to avoid making real API requests
vi.mock('../services/githubService.js', () => ({
  fetchProfile: vi.fn(),
  fetchRepositories: vi.fn(),
}));

describe('GitHub Explorer Backend Tests', () => {
  beforeEach(() => {
    // Clear all cache and mock calls before each test
    cache.flush();
    vi.clearAllMocks();
  });

  describe('Cache Logic (node-cache wrapper)', () => {
    it('should set and get values from cache', () => {
      const key = 'test-key';
      const data = { message: 'hello world' };

      cache.set(key, data, 10);
      const retrieved = cache.get(key);

      expect(retrieved).toEqual(data);
    });

    it('should return null for expired or non-existent keys', () => {
      const retrieved = cache.get('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should delete keys successfully', () => {
      const key = 'delete-key';
      cache.set(key, { value: 123 });
      expect(cache.get(key)).not.toBeNull();

      cache.del(key);
      expect(cache.get(key)).toBeNull();
    });
  });

  describe('API Endpoints (Express Proxy)', () => {
    const mockProfile = {
      avatar: 'https://avatar.url',
      name: 'Test User',
      username: 'testuser',
      bio: 'Developer bio',
      followers: 10,
      following: 5,
      publicRepos: 1
    };

    const mockRepos = [
      {
        id: 12345,
        name: 'test-repo',
        description: 'Repo desc',
        primaryLanguage: 'JavaScript',
        starCount: 50,
        lastUpdatedDate: '2023-12-01T00:00:00Z',
        openIssuesCount: 2,
        forkCount: 4,
        defaultBranch: 'main',
        repositoryUrl: 'https://github.com/testuser/test-repo',
        visibility: 'Public'
      }
    ];

    it('should fetch user details and repositories successfully', async () => {
      // Mock service resolutions
      vi.mocked(githubService.fetchProfile).mockResolvedValue(mockProfile);
      vi.mocked(githubService.fetchRepositories).mockResolvedValue(mockRepos);

      const response = await request(app)
        .get('/api/github/testuser')
        .expect(200);

      expect(response.body).toHaveProperty('profile');
      expect(response.body.profile.username).toBe('testuser');
      expect(response.body).toHaveProperty('repositories');
      expect(response.body.repositories).toHaveLength(1);

      // Verify that endpoints logic stores response inside cache
      expect(cache.has('user-details-testuser')).toBe(true);
    });

    it('should return cached details on subsequent requests without calling service', async () => {
      vi.mocked(githubService.fetchProfile).mockResolvedValue(mockProfile);
      vi.mocked(githubService.fetchRepositories).mockResolvedValue(mockRepos);

      // Call 1: Misses cache, calls service
      await request(app).get('/api/github/testuser').expect(200);
      expect(githubService.fetchProfile).toHaveBeenCalledTimes(1);

      // Call 2: Hits cache, should NOT call service again
      const response = await request(app).get('/api/github/testuser').expect(200);
      
      expect(response.body.profile.username).toBe('testuser');
      expect(githubService.fetchProfile).toHaveBeenCalledTimes(1); // Still 1
    });

    it('should handle "User not found" errors and return 404', async () => {
      const notFoundError = new Error('User not found.');
      notFoundError.status = 404;
      vi.mocked(githubService.fetchProfile).mockRejectedValue(notFoundError);

      const response = await request(app)
        .get('/api/github/nonexistentuser')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'User not found.'
      });
    });

    it('should handle "Rate limit" errors and return 429', async () => {
      const rateLimitError = new Error('GitHub API rate limit reached. Please try again later.');
      rateLimitError.status = 429;
      vi.mocked(githubService.fetchProfile).mockRejectedValue(rateLimitError);

      const response = await request(app)
        .get('/api/github/ratelimituser')
        .expect(429);

      expect(response.body).toEqual({
        success: false,
        message: 'GitHub API rate limit reached. Please try again later.'
      });
    });
  });
});
