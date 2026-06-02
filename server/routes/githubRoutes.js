import express from 'express';
import { getGitHubDetails, getGitHubRepos } from '../controllers/githubController.js';

const router = express.Router();

// Get profile and repos (up to 100)
router.get('/:username', getGitHubDetails);

// Get paginated repositories
router.get('/:username/repos', getGitHubRepos);

export default router;
