import React, { useState } from 'react';
import { Star, GitFork, AlertCircle, GitBranch, ExternalLink, ChevronDown, ChevronUp, Lock, Globe } from 'lucide-react';
import { formatDate } from '../utils/formatters.js';

// Simple colors for popular GitHub languages
const getLanguageColor = (lang) => {
  const colors = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-500',
    HTML: 'bg-orange-600',
    CSS: 'bg-purple-500',
    Python: 'bg-blue-400',
    Go: 'bg-cyan-400',
    Rust: 'bg-amber-600',
    Ruby: 'bg-red-500',
    Java: 'bg-orange-500',
    PHP: 'bg-indigo-400',
    C: 'bg-gray-500',
    'C++': 'bg-pink-500',
    'C#': 'bg-emerald-500',
    Shell: 'bg-green-500',
    Vue: 'bg-emerald-400',
    Swift: 'bg-orange-400'
  };
  return colors[lang] || 'bg-zinc-500';
};

/**
 * Expandable Repository Card Component
 * @param {object} props
 * @param {object} props.repo
 */
export default function RepoCard({ repo }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div
      onClick={toggleExpand}
      className={`bg-card-dark border ${
        isExpanded ? 'border-indigo-500/50 shadow-glow-primary' : 'border-border-dark hover:border-zinc-800'
      } rounded-xl p-5 transition-all duration-300 cursor-pointer select-none group flex flex-col justify-between`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[85%]">
            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors truncate text-base">
              {repo.name}
            </h3>
            <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
              {repo.description}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            aria-label={isExpanded ? 'Collapse repository' : 'Expand repository'}
            className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Basic Stats Footer */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-border-dark/50 text-xs text-zinc-500">
        {/* Primary Language */}
        <div className="flex items-center space-x-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.primaryLanguage)}`}></span>
          <span className="font-medium text-zinc-400">{repo.primaryLanguage}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 text-yellow-500" />
          <span>{repo.starCount.toLocaleString()}</span>
        </div>

        {/* Updated Date */}
        <div className="text-zinc-500">
          Updated {formatDate(repo.lastUpdatedDate)}
        </div>
      </div>

      {/* Expanded details container with smooth grid transition */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-dark bg-zinc-900/30 p-3 rounded-lg text-xs">
            <div className="flex items-center text-zinc-400 space-x-2">
              <AlertCircle className="w-3.5 h-3.5 text-accent-warning" />
              <span>Issues: <strong className="text-white">{repo.openIssuesCount}</strong></span>
            </div>
            
            <div className="flex items-center text-zinc-400 space-x-2">
              <GitFork className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Forks: <strong className="text-white">{repo.forkCount}</strong></span>
            </div>

            <div className="flex items-center text-zinc-400 space-x-2">
              <GitBranch className="w-3.5 h-3.5 text-accent-primary" />
              <span className="truncate">Branch: <strong className="text-white">{repo.defaultBranch}</strong></span>
            </div>

            <div className="flex items-center text-zinc-400 space-x-2">
              {repo.visibility === 'Public' ? (
                <Globe className="w-3.5 h-3.5 text-accent-success" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>Visibility: <strong className="text-white">{repo.visibility}</strong></span>
            </div>

            <div className="col-span-2 pt-2 flex justify-end">
              <a
                href={repo.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Stop expansion toggle when clicking link
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors font-medium border border-zinc-700/50"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
