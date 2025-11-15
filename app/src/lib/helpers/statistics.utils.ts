// Utility functions
export const getSuccessColor = (rate: number): string => {
  if (rate >= 80) return 'bg-green-100 text-green-800';
  if (rate >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getProgressColor = (rate: number): string => {
  if (rate >= 80) return 'bg-green-500';
  if (rate >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};