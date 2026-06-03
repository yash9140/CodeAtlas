import React from 'react';
import { AlertCircle, Search, WifiOff, Hourglass } from 'lucide-react';

/**
 * Renders user-friendly and aesthetically polished error screens depending on error type.
 * @param {object} props
 * @param {Error} props.error
 * @param {Function} props.onRetry
 */
export default function ErrorDisplay({ error, onRetry }) {
  const message = error?.message || '';

  // Determine error category based on content
  const isNotFound = message.toLowerCase().includes('not found');
  const isRateLimit = message.toLowerCase().includes('rate limit');
  const isOffline = message.toLowerCase().includes('network') || message.toLowerCase().includes('unreachable');

  let Icon = AlertCircle;
  let title = 'Something went wrong';
  let description = message || 'An unexpected error occurred. Please check and try again.';

  if (isNotFound) {
    Icon = Search;
    title = 'User not found';
    description = "We couldn't find any GitHub user matching that username. Please double-check spelling.";
  } else if (isRateLimit) {
    Icon = Hourglass;
    title = 'Rate limit reached';
    description = 'GitHub API rate limit exceeded. The backend caches profile data for 60 seconds, but external limits have been reached. Please try again shortly.';
  } else if (isOffline) {
    Icon = WifiOff;
    title = 'Network error';
    description = 'Unable to establish a connection to the server. Please verify the backend API server is running and check your network.';
  }

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-8 max-w-lg mx-auto text-center my-8 shadow-lg animate-fade-in">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
          <Icon className="w-10 h-10" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{description}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-glow-primary hover:shadow-indigo-500/25 border border-indigo-500/30 active:scale-95"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
