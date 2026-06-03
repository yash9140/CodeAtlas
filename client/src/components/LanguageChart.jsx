import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Premium theme colors for language wedges
const CHART_COLORS = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
];

/**
 * Renders language analytics chart based on repositories
 * @param {object} props
 * @param {Array} props.repositories
 */
export default function LanguageChart({ repositories }) {
  const chartData = useMemo(() => {
    if (!repositories || repositories.length === 0) return [];

    // Count language occurrences
    const counts = {};
    repositories.forEach(repo => {
      const lang = repo.primaryLanguage || 'Unknown';
      counts[lang] = (counts[lang] || 0) + 1;
    });

    // Format for Recharts and sort by count descending
    const formatted = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Limit to top 5 languages, grouping the rest into 'Others'
    if (formatted.length > 5) {
      const topFive = formatted.slice(0, 5);
      const othersCount = formatted.slice(5).reduce((acc, curr) => acc + curr.value, 0);
      return [...topFive, { name: 'Others', value: othersCount }];
    }

    return formatted;
  }, [repositories]);

  if (chartData.length === 0) {
    return (
      <div className="bg-card-dark border border-border-dark rounded-xl p-6 h-[340px] flex items-center justify-center text-zinc-500">
        No languages to analyze
      </div>
    );
  }

  // Custom tooltips matching the dark theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((acc, c) => acc + c.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-xs shadow-xl">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="text-indigo-400 mt-1">
            {data.value} {data.value === 1 ? 'repo' : 'repos'} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6 flex flex-col justify-between h-[340px] hover:border-zinc-800 transition-colors duration-300">
      <div>
        <h3 className="text-sm font-semibold text-white">Language Analytics</h3>
        <p className="text-zinc-500 text-xs mt-0.5">Most common repository languages</p>
      </div>

      <div className="h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="48%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconSize={8}
              iconType="circle"
              formatter={(value) => <span className="text-zinc-400 text-xs font-medium hover:text-white transition-colors">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
