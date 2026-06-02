import app from './app.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.success(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  if (process.env.GITHUB_TOKEN) {
    logger.info('GitHub Token detected. Using authenticated rate limits.');
  } else {
    logger.warn('No GITHUB_TOKEN detected. Rate limits will be capped to 60 req/hr.');
  }
});
