import React from 'react';
import { History, X, User } from 'lucide-react';

/**
 * Renders history of successfully searched GitHub usernames from localStorage
 * @param {object} props
 * @param {Array<string>} props.searches - List of past usernames
 * @param {Function} props.onSelect - Callback when history item is clicked
 * @param {Function} props.onClear - Callback when clearing single or all items
 */
export default function RecentSearches({ searches, onSelect, onClear }) {
  if (!searches || searches.length === 0) {
    return (
      <div className="bg-card-dark border border-border-dark rounded-xl p-5 hover:border-zinc-800 transition-colors duration-300">
        <div className="flex items-center space-x-2 text-zinc-400 mb-3">
          <History className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Recent Searches</h3>
        </div>
        <p className="text-zinc-500 text-xs">No recent searches yet. Search a user to populate history.</p>
      </div>
    );
  }

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-5 hover:border-zinc-800 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-zinc-400">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Recent Searches</h3>
        </div>
        <button
          onClick={() => onClear(null)} // Clear all callback
          className="text-[10px] text-zinc-500 hover:text-red-400 uppercase font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <ul className="space-y-2">
        {searches.map((username) => (
          <li
            key={username}
            className="flex items-center justify-between group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/40 hover:border-zinc-800 rounded-lg p-2 transition-all cursor-pointer"
            onClick={() => onSelect(username)}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <div className="p-1 bg-zinc-800 text-zinc-400 rounded-md group-hover:text-indigo-400 transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
                {username}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear(username);
              }}
              className="p-1 text-zinc-600 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
              aria-label={`Remove ${username} from history`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
