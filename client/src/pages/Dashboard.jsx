import React, { useState, useEffect, useMemo } from 'react';
import { Search, Github, SlidersHorizontal, ChevronRight, BookMarked, Activity } from 'lucide-react';
import { useGitHubQuery } from '../hooks/useGitHubQuery.js';
import ProfileCard from '../components/ProfileCard.jsx';
import RepoCard from '../components/RepoCard.jsx';
import LanguageChart from '../components/LanguageChart.jsx';
import RecentSearches from '../components/RecentSearches.jsx';
import ErrorDisplay from '../components/ErrorDisplay.jsx';
import { ProfileSkeleton, RepositoriesGridSkeleton } from '../components/LoadingSkeleton.jsx';

export default function Dashboard() {
  const [searchInput, setSearchInput] = useState('');
  const [activeUsername, setActiveUsername] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'stars' | 'name'
  const [visibleCount, setVisibleCount] = useState(12);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recent_github_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches from LocalStorage:', e);
    }
  }, []);

  // Fetch query using our React Query wrapper
  const { data, isLoading, isError, error, refetch } = useGitHubQuery(activeUsername);

  // Sync successful search with LocalStorage
  useEffect(() => {
    if (data && activeUsername) {
      setRecentSearches((prev) => {
        // Prevent duplicate entries
        const filtered = prev.filter((item) => item.toLowerCase() !== activeUsername.toLowerCase());
        const updated = [activeUsername, ...filtered].slice(0, 5); // Keep top 5
        localStorage.setItem('recent_github_searches', JSON.stringify(updated));
        return updated;
      });
    }
  }, [data, activeUsername]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      setActiveUsername(query);
      setVisibleCount(12); // Reset pagination on search
    }
  };

  const handleRecentSelect = (username) => {
    setSearchInput(username);
    setActiveUsername(username);
    setVisibleCount(12);
  };

  const handleRecentClear = (username) => {
    let updated;
    if (username === null) {
      updated = [];
    } else {
      updated = recentSearches.filter((item) => item !== username);
    }
    setRecentSearches(updated);
    localStorage.setItem('recent_github_searches', JSON.stringify(updated));
  };

  // Sort and filter repositories client-side for instant updates
  const sortedRepositories = useMemo(() => {
    if (!data?.repositories) return [];

    return [...data.repositories].sort((a, b) => {
      if (sortBy === 'stars') {
        return b.starCount - a.starCount;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Default: Last Updated
      return new Date(b.lastUpdatedDate) - new Date(a.lastUpdatedDate);
    });
  }, [data?.repositories, sortBy]);

  // Paginate repositories list
  const paginatedRepositories = useMemo(() => {
    return sortedRepositories.slice(0, visibleCount);
  }, [sortedRepositories, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col">
      {/* Premium Header */}
      <header className="border-b border-border-dark bg-zinc-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
              <Github className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">GitHub Explorer</span>
          </div>
          
          <div className="flex items-center space-x-2 text-[11px] font-medium text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span>API Gateway: Operational</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
        {/* Title Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gradient">
            GitHub Repo Explorer
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Explore GitHub profiles, repository details, and language analytics instantly.
          </p>
        </div>

        {/* Search Panel */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-4 text-zinc-500 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter GitHub username (e.g. octocat, torvalds)..."
              aria-label="GitHub username search input"
              className="w-full bg-card-dark border border-border-dark text-slate-100 placeholder-zinc-500 pl-12 pr-32 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all border border-indigo-500/20 shadow-glow-primary active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Profile Card, History, Charts */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Skeletons / Normal Render for Profile Card */}
            {isLoading && <ProfileSkeleton />}
            
            {!isLoading && !isError && data && (
              <>
                <ProfileCard profile={data.profile} />
                <LanguageChart repositories={data.repositories} />
              </>
            )}

            {/* Recent Searches (always visible, updates dynamically) */}
            <RecentSearches
              searches={recentSearches}
              onSelect={handleRecentSelect}
              onClear={handleRecentClear}
            />
          </div>

          {/* Right Column: Repositories List */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading && (
              <div className="space-y-6">
                <div className="h-10 w-full bg-zinc-900 border border-zinc-800/60 rounded-lg animate-pulse"></div>
                <RepositoriesGridSkeleton />
              </div>
            )}

            {isError && (
              <ErrorDisplay error={error} onRetry={refetch} />
            )}

            {!isLoading && !isError && data && (
              <div className="space-y-6 animate-slide-up">
                
                {/* Repository Filter & Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card-dark border border-border-dark rounded-xl">
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <BookMarked className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold">
                      Repositories ({sortedRepositories.length})
                    </span>
                  </div>

                  {/* Sorting Controls */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center space-x-1.5 text-zinc-500 text-xs">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Sort by:</span>
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Sort repositories selection"
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                    >
                      <option value="updated">Last Updated</option>
                      <option value="stars">Stars</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>

                {/* Empty State */}
                {sortedRepositories.length === 0 ? (
                  <div className="bg-card-dark border border-border-dark rounded-xl p-12 text-center text-zinc-500">
                    <BookMarked className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                    <p className="text-sm">No repositories found for this user.</p>
                  </div>
                ) : (
                  <>
                    {/* Repository Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedRepositories.map((repo) => (
                        <RepoCard key={repo.id} repo={repo} />
                      ))}
                    </div>

                    {/* Pagination Load More Button */}
                    {visibleCount < sortedRepositories.length && (
                      <div className="flex justify-center pt-4">
                        <button
                          onClick={handleLoadMore}
                          className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 active:scale-95"
                        >
                          <span>Load More Repositories</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Empty state when no username is entered */}
            {!isLoading && !isError && !data && (
              <div className="bg-card-dark border border-border-dark rounded-xl p-12 text-center max-w-md mx-auto my-12">
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Find a Profile</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Enter a GitHub username in the search bar above to load profile details, repositories, and language statistics.
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
