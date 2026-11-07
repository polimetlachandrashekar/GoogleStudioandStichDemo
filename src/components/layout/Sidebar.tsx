import React from 'react';
import {
  Calendar,
  CheckSquare,
  FolderKanban,
  Settings,
  Star,
  Flame,
  Briefcase,
  User,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { NavigationTab, UserSettings } from '../../types';
import { Avatar } from '../ui/Avatar';

export interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeFilter?: string | null;
  onSelectFilter?: (filter: string | null) => void;
  onOpenCommandPalette: () => void;
  userSettings: UserSettings;
  counts: {
    today: number;
    starred: number;
    highPriority: number;
    work: number;
    personal: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeFilter,
  onSelectFilter,
  onOpenCommandPalette,
  userSettings,
  counts,
}) => {
  const mainNavItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'today',
      label: "Today's Tasks",
      icon: <CheckSquare className="w-4 h-4" />,
      badge: counts.today,
    },
    {
      id: 'schedule',
      label: 'Upcoming Schedule',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'projects',
      label: 'Projects & Workspaces',
      icon: <FolderKanban className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const quickFilters = [
    {
      id: 'starred',
      label: 'Starred',
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />,
      count: counts.starred,
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />,
      count: counts.highPriority,
    },
    {
      id: 'work',
      label: 'Work',
      icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" />,
      count: counts.work,
    },
    {
      id: 'personal',
      label: 'Personal',
      icon: <User className="w-3.5 h-3.5 text-teal-500" />,
      count: counts.personal,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-screen shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {/* Stylized FlowDo geometric mark */}
          <div className="w-8 h-8 rounded-lg bg-[#5C52E5] flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
              FlowDo
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Workspace
            </span>
          </div>
        </div>

        <button
          onClick={onOpenCommandPalette}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          title="Command Palette (⌘K)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Search Button */}
      <div className="p-3">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100/90 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200/70 text-xs transition-all duration-150 group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            <span className="text-slate-500 font-medium truncate">Search tasks, projects...</span>
          </span>
          <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-6">
        {/* Main Views */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            Navigation
          </div>
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onSelectFilter) onSelectFilter(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#5C52E5] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            Quick Filters
          </div>
          <div className="space-y-0.5">
            {quickFilters.map((filter) => {
              const isFilterActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    if (onSelectFilter) {
                      onSelectFilter(isFilterActive ? null : filter.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isFilterActive
                      ? 'bg-[#EEECFC] text-[#5C52E5] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {filter.icon}
                    <span>{filter.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 tabular-nums font-mono">
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile at Bottom */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => onSelectTab('settings')}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              name={userSettings.profile.name}
              size="sm"
              status="online"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate group-hover:text-[#5C52E5]">
                {userSettings.profile.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {userSettings.profile.email}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#5C52E5] bg-[#EEECFC] px-1.5 py-0.5 rounded">
            PRO
          </span>
        </button>
      </div>
    </aside>
  );
};
