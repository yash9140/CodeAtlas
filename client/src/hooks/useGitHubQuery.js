import { useQuery } from '@tanstack/react-query';
import { getGitHubUser } from '../services/api.js';

/**
 * React Query hook to fetch user details (profile and repositories).
 * Caches queries locally, manages loading and error states.
 * @param {string} username 
 * @returns {object} Query response object
 */
export function useGitHubQuery(username) {
  const normalizedUsername = username?.trim().toLowerCase();

  return useQuery({
    queryKey: ['github-user', normalizedUsername],
    queryFn: () => getGitHubUser(normalizedUsername),
    enabled: !!normalizedUsername, // Only fetch if username is not empty
    staleTime: 60 * 1000,          // Cache is fresh for 60 seconds
    gcTime: 5 * 60 * 1000,         // Cache resides in memory for 5 minutes (garbage collection time in v5)
  });
}
