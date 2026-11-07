export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'in_progress' | 'completed' | 'todo' | 'blocked';
export type TaskCategory = 'work' | 'personal' | 'habits';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  name: string;
  size?: string;
  updated?: string;
  type?: string;
  url?: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  avatar?: string;
  action: string;
  time: string;
}

export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  project: string;
  dueDate: string;
  dueTime?: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  tags: string[];
  subtasks: Subtask[];
  attachments?: Attachment[];
  activity: ActivityItem[];
  column?: 'tomorrow' | 'weekend' | 'nextWeek' | 'today';
  notes?: string;
  timeEstimate?: string;
  milestones?: string;
}

export type WorkspaceStatus = 'in_progress' | 'on_track' | 'needs_attention' | 'ongoing';

export interface Workspace {
  id: string;
  name: string;
  subtitle: string;
  status: WorkspaceStatus;
  statusLabel: string;
  progress: number;
  tasksCount: number;
  completedCount: number;
  metricLabel?: string;
  cadence?: string;
  tags: string[];
  lastUpdated: string;
  blockers?: number;
  dueDate?: string;
  members: { name: string; avatar?: string }[];
  category: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  timezone: string;
  workingHoursStart: string;
  workingHoursEnd: string;
}

export interface ProductivitySettings {
  defaultProject: string;
  reminderLeadTime: string;
  naturalLanguageParsing: boolean;
  autoRescheduleOverdue: boolean;
}

export interface NotificationSettings {
  dailySmartDigest: boolean;
  dailySmartDigestChannel: string;
  highPriorityAlerts: boolean;
  highPriorityChannel: string;
  soundFx: boolean;
  soundProfile: string;
}

export interface UserSettings {
  profile: UserProfile;
  productivity: ProductivitySettings;
  notifications: NotificationSettings;
}

export type NavigationTab = 'today' | 'schedule' | 'projects' | 'settings';
export type ScheduleViewMode = 'day' | 'week' | 'month';
