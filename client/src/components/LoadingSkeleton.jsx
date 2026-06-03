import React from 'react';

/**
 * Skeleton loader for user profile card
 */
export function ProfileSkeleton() {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6 shadow-glow-primary animate-pulse w-full max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar skeleton */}
        <div className="w-24 h-24 rounded-full bg-zinc-800 animate-pulse"></div>
        {/* Name and Username */}
        <div className="space-y-2 w-full flex flex-col items-center">
          <div className="h-6 w-32 bg-zinc-800 rounded"></div>
          <div className="h-4 w-20 bg-zinc-800 rounded"></div>
        </div>
        {/* Bio */}
        <div className="h-4 w-5/6 bg-zinc-800 rounded mt-2"></div>
        <div className="h-4 w-4/6 bg-zinc-800 rounded"></div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border-dark">
          <div className="flex flex-col items-center space-y-1">
            <div className="h-5 w-8 bg-zinc-800 rounded"></div>
            <div className="h-3 w-12 bg-zinc-800 rounded"></div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="h-5 w-8 bg-zinc-800 rounded"></div>
            <div className="h-3 w-12 bg-zinc-800 rounded"></div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="h-5 w-8 bg-zinc-800 rounded"></div>
            <div className="h-3 w-12 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for individual repository cards
 */
export function RepoCardSkeleton() {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-5 flex flex-col justify-between space-y-4 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-1/2 bg-zinc-800 rounded"></div>
          <div className="h-5 w-12 bg-zinc-800 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-800 rounded"></div>
          <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
        </div>
      </div>
      <div className="flex items-center space-y-0 space-x-4 pt-2">
        <div className="h-3 w-16 bg-zinc-800 rounded"></div>
        <div className="h-3 w-12 bg-zinc-800 rounded"></div>
        <div className="h-3 w-24 bg-zinc-800 rounded"></div>
      </div>
    </div>
  );
}

/**
 * Grid of repository skeletons
 */
export function RepositoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <RepoCardSkeleton key={idx} />
      ))}
    </div>
  );
}
