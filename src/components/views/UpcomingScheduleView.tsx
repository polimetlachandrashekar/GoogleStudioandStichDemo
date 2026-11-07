import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Calendar,
  Clock,
  Plus,
  Paperclip,
  CheckCircle2,
  Circle,
  FileText,
  AlertTriangle,
  Flame,
  Check,
  Zap,
} from 'lucide-react';
import { Task, ScheduleViewMode } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { CircularProgress } from '../ui/ProgressBar';

export interface UpcomingScheduleViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenDetailsDrawer: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onOpenNewTaskModal: (defaultColumn?: 'tomorrow' | 'weekend' | 'nextWeek') => void;
  onApplyAutoBalance: () => void;
  autoBalanceApplied: boolean;
}

export const UpcomingScheduleView: React.FC<UpcomingScheduleViewProps> = ({
  tasks,
  onSelectTask,
  onOpenDetailsDrawer,
  onToggleComplete,
  onOpenNewTaskModal,
  onApplyAutoBalance,
  autoBalanceApplied,
}) => {
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('week');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // Group tasks by columns
  const tomorrowTasks = tasks.filter(
    (t) => t.column === 'tomorrow' && (!activeTagFilter || t.tags.includes(activeTagFilter))
  );
  const weekendTasks = tasks.filter(
    (t) => t.column === 'weekend' && (!activeTagFilter || t.tags.includes(activeTagFilter))
  );
  const nextWeekTasks = tasks.filter(
    (t) => t.column === 'nextWeek' && (!activeTagFilter || t.tags.includes(activeTagFilter))
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#F8F9FD]">
      {/* Schedule Top Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>October 2024</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                (W43 – 44)
              </span>
            </h2>
          </div>
        </div>

        {/* View Mode Switcher & Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week (Agenda)
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() =>
              setActiveTagFilter(activeTagFilter ? null : '#design-system')
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              activeTagFilter
                ? 'bg-[#EEECFC] text-[#5C52E5] border-[#5C52E5]/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{activeTagFilter ? `Filtered: ${activeTagFilter}` : 'Filter'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Upcoming Tasks */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Upcoming Tasks
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            18 Tasks
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Across 3 active cycles</span>
        </div>

        {/* Metric 2: Focus Blocks */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Focus Blocks
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            14.5 Hours
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">
            +2.0h uninterrupted buffer
          </span>
        </div>

        {/* Metric 3: Deadlines Nearing */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Deadlines Nearing
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <span className="tabular-nums">3 Urgent</span>
          </div>
          <span className="text-[11px] text-rose-600 font-medium block mt-1">
            Requires priority focus
          </span>
        </div>

        {/* Metric 4: Schedule Capacity */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Schedule Capacity
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              82%
            </div>
            <span className="text-[11px] text-[#5C52E5] font-semibold block mt-1">
              Optimal Flow
            </span>
          </div>
          <CircularProgress
            progress={82}
            size={48}
            strokeWidth={4.5}
            color="#5C52E5"
            trackColor="#E2E8F0"
          />
        </div>
      </div>

      {/* 3 Agenda Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1: Tomorrow */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Tomorrow</span>
              <span className="text-xs text-slate-400 font-medium">Fri Oct 25</span>
              <span className="text-[11px] bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded font-semibold tabular-nums">
                {tomorrowTasks.length}
              </span>
            </div>
            <button
              onClick={() => onOpenNewTaskModal('tomorrow')}
              className="p-1 rounded text-slate-400 hover:text-[#5C52E5] hover:bg-white transition-colors"
              title="Add task to tomorrow"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {tomorrowTasks.map((task) => (
              <ScheduleCard
                key={task.id}
                task={task}
                onSelectTask={onSelectTask}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>

        {/* Column 2: This Weekend */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">This Weekend</span>
              <span className="text-xs text-slate-400 font-medium">Oct 26 - 27</span>
              <span className="text-[11px] bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded font-semibold tabular-nums">
                {weekendTasks.length}
              </span>
            </div>
            <button
              onClick={() => onOpenNewTaskModal('weekend')}
              className="p-1 rounded text-slate-400 hover:text-[#5C52E5] hover:bg-white transition-colors"
              title="Add task to weekend"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {weekendTasks.map((task) => (
              <ScheduleCard
                key={task.id}
                task={task}
                onSelectTask={onSelectTask}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>

        {/* Column 3: Next Week */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Next Week</span>
              <span className="text-xs text-slate-400 font-medium">Oct 28 - Nov 01</span>
              <span className="text-[11px] bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded font-semibold tabular-nums">
                {nextWeekTasks.length}
              </span>
            </div>
            <button
              onClick={() => onOpenNewTaskModal('nextWeek')}
              className="p-1 rounded text-slate-400 hover:text-[#5C52E5] hover:bg-white transition-colors"
              title="Add task to next week"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {nextWeekTasks.map((task) => (
              <ScheduleCard
                key={task.id}
                task={task}
                onSelectTask={onSelectTask}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Smart Optimization Callout Banner (Matching Screen 1) */}
      {!bannerDismissed && (
        <div className="bg-white rounded-2xl p-5 border border-indigo-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEECFC] text-[#5C52E5] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#5C52E5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Auto-Balance Agenda Detected</span>
                <span className="text-[11px] font-semibold text-[#5C52E5] bg-[#EEECFC] px-2 py-0.5 rounded-full">
                  {autoBalanceApplied ? '✓ Schedule Optimized' : '2 Suggestions Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {autoBalanceApplied
                  ? 'Calendar Micro-interaction Specs has been rescheduled to Monday morning. You now have a clean 3-hour deep work window tomorrow afternoon.'
                  : 'Tomorrow afternoon has 2.5 consecutive hours of back-to-back meetings without buffer time. We suggest moving Calendar Micro-interaction Specs to Monday morning to reclaim unbroken focus.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBannerDismissed(true)}
            >
              Dismiss
            </Button>
            {!autoBalanceApplied ? (
              <Button
                variant="primary"
                size="sm"
                onClick={onApplyAutoBalance}
                icon={<Zap className="w-3.5 h-3.5" />}
              >
                Apply Auto-Balance
              </Button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 px-3 py-1.5 bg-emerald-50 rounded-lg">
                Applied
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface ScheduleCardProps {
  task: Task;
  onSelectTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  task,
  onSelectTask,
  onToggleComplete,
}) => {
  const isCompleted = task.status === 'completed';

  return (
    <div
      onClick={() => onSelectTask(task)}
      className="bg-white rounded-xl p-4 border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all duration-150 cursor-pointer select-none space-y-2.5 group"
    >
      {/* Top Header Row with Time & Tag */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{task.dueTime || '09:00 AM'}</span>
        </div>

        {task.priority === 'urgent' && (
          <Badge variant="urgent">High Priority</Badge>
        )}
        {task.priority === 'high' && (
          <Badge variant="high">High Priority</Badge>
        )}
        {task.tags.includes('#deep-work') && (
          <Badge variant="purple">Deep Work</Badge>
        )}
        {task.tags.includes('#1on1') && (
          <Badge variant="neutral">1:1 Check-in</Badge>
        )}
        {task.category === 'personal' && (
          <Badge variant="habit">Personal</Badge>
        )}
      </div>

      {/* Title */}
      <div>
        <h4
          className={`text-sm font-bold text-slate-800 group-hover:text-[#5C52E5] transition-colors leading-snug ${
            isCompleted ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.title}
        </h4>
        {task.subtitle && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {task.subtitle}
          </p>
        )}
      </div>

      {/* Project & Attachment row */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
        <span className="font-medium text-slate-600 truncate max-w-[140px]">
          {task.project}
        </span>

        {task.attachments && task.attachments.length > 0 && (
          <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
            <Paperclip className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[100px]">
              {task.attachments[0].name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
