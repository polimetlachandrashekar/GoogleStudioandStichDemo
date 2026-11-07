import React from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { NavigationTab, UserSettings } from '../../types';

export interface TopHeaderProps {
  currentTab: NavigationTab;
  onOpenNewTaskModal: () => void;
  onOpenCommandPalette: () => void;
  onOptimizeSchedule?: () => void;
  userSettings: UserSettings;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onOpenNewTaskModal,
  onOpenCommandPalette,
  onOptimizeSchedule,
  userSettings,
}) => {
  const getBreadcrumb = () => {
    switch (currentTab) {
      case 'today':
        return {
          parent: 'WORKSPACE',
          current: "Today's Tasks",
          cycle: 'Sprint Cycle 44',
        };
      case 'schedule':
        return {
          parent: 'PLANNING',
          current: 'Upcoming Schedule',
          cycle: 'Q4 Velocity',
        };
      case 'projects':
        return {
          parent: 'PORTFOLIO OVERVIEW',
          current: 'Projects & Workspaces',
          cycle: '4 Active Initiatives',
        };
      case 'settings':
        return {
          parent: 'WORKSPACE',
          current: 'Settings & Preferences',
          cycle: 'v2.2 Pro',
        };
      default:
        return { parent: 'WORKSPACE', current: 'Dashboard', cycle: '' };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-16 px-6 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 flex items-center justify-between gap-6 shrink-0 z-20">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {breadcrumb.parent}
        </span>
        <span className="text-slate-300 text-xs">/</span>
        <h1 className="text-sm font-bold text-slate-800 tracking-tight whitespace-nowrap">
          {breadcrumb.current}
        </h1>
        {breadcrumb.cycle && (
          <>
            <span className="text-slate-300 text-xs hidden sm:inline">·</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {breadcrumb.cycle}
            </span>
          </>
        )}
      </div>

      {/* Center: Global Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200/80 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Search tasks, projects, tags...</span>
          </div>
          <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {currentTab === 'schedule' && onOptimizeSchedule && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOptimizeSchedule}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#5C52E5]" />}
            className="hidden sm:inline-flex"
          >
            Optimize Schedule
          </Button>
        )}

        {/* Primary New Task Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenNewTaskModal}
          icon={<Plus className="w-4 h-4" />}
          className="shadow-sm font-semibold hover:shadow"
        >
          <span>New Task</span>
          <span className="hidden sm:inline text-[11px] font-mono opacity-80 pl-1 border-l border-white/25 ml-1">
            Shift+N
          </span>
        </Button>

        {/* User Pill in Header */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
          <Avatar
            name={userSettings.profile.name}
            size="sm"
            status="online"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {userSettings.profile.name}
            </span>
            <span className="text-[10px] font-semibold text-[#5C52E5] leading-tight">
              PRO
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
