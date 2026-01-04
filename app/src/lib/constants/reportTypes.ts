export interface ReportType {
  id: string;
  name: string;
  description: string;
  category: 'player' | 'team' | 'episode' | 'comparative';
  icon: string;
  canCompare: boolean;
  canSchedule: boolean;
}

// Report types configuration
export const REPORT_TYPES: Record<string, ReportType> = {
  playerOverview: {
    id: 'player-overview',
    name: 'Player Overview',
    description: 'Comprehensive player performance analysis',
    category: 'player',
    icon: 'User',
    canCompare: true,
    canSchedule: true,
  },
  teamPerformance: {
    id: 'team-performance',
    name: 'Team Performance',
    description: 'Team-wide statistics and weakness analysis',
    category: 'team',
    icon: 'Users',
    canCompare: true,
    canSchedule: true,
  },
  episodeAnalysis: {
    id: 'episode-analysis',
    name: 'Episode Analysis',
    description: 'Deep dive into specific episode performance',
    category: 'episode',
    icon: 'Activity',
    canCompare: true,
    canSchedule: false,
  },
};
