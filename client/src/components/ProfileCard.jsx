import React from 'react';
import { Users, BookOpen, ExternalLink, Calendar } from 'lucide-react';

/**
 * Elegant GitHub Profile Card component
 * @param {object} props
 * @param {object} props.profile - The github profile data object
 */
export default function ProfileCard({ profile }) {
  if (!profile) return null;

  const {
    avatar,
    name,
    username,
    bio,
    followers,
    following,
    publicRepos
  } = profile;

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6 shadow-glow-primary hover:border-zinc-800 transition-all duration-300 w-full animate-slide-up flex flex-col justify-between">
      <div>
        {/* User Info Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
            <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="relative w-24 h-24 rounded-full border border-border-dark object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">{name}</h2>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center justify-center space-x-1 group"
            >
              <span>@{username}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Bio */}
        <p className="text-zinc-400 text-sm text-center mt-4 leading-relaxed line-clamp-3">
          {bio}
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-2 w-full pt-5 mt-6 border-t border-border-dark text-center">
        <div className="p-2 hover:bg-zinc-900/50 rounded-lg transition-colors">
          <div className="flex items-center justify-center text-zinc-500 mb-1">
            <Users className="w-4 h-4 mr-1 text-indigo-400" />
            <span className="text-xs font-medium">Followers</span>
          </div>
          <span className="text-base font-semibold text-white">
            {followers.toLocaleString()}
          </span>
        </div>

        <div className="p-2 hover:bg-zinc-900/50 rounded-lg transition-colors">
          <div className="flex items-center justify-center text-zinc-500 mb-1">
            <Users className="w-4 h-4 mr-1 text-blue-400" />
            <span className="text-xs font-medium">Following</span>
          </div>
          <span className="text-base font-semibold text-white">
            {following.toLocaleString()}
          </span>
        </div>

        <div className="p-2 hover:bg-zinc-900/50 rounded-lg transition-colors">
          <div className="flex items-center justify-center text-zinc-500 mb-1">
            <BookOpen className="w-4 h-4 mr-1 text-emerald-400" />
            <span className="text-xs font-medium">Repos</span>
          </div>
          <span className="text-base font-semibold text-white">
            {publicRepos.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
