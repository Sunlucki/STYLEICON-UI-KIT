export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface StatData {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  trend?: 'up' | 'down' | 'flat';
}

export interface RecentActivity {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';
  amount?: string;
  date: string;
}
