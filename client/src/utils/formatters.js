/**
 * Format ISO Date string into reader friendly format (e.g. Jun 3, 2026)
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  // Custom format: "MMM D, YYYY"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
