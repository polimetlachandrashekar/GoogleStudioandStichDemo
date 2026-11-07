import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Share2,
  Maximize2,
  Sparkles,
  Zap,
  Tag,
  AtSign,
  Plus,
  Send,
  FileText,
  ExternalLink,
  ChevronDown,
  Moon,
  AlertCircle,
} from 'lucide-react';
import { Task, Subtask, Priority } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { CircularProgress, ProgressBar } from '../ui/ProgressBar';

export interface TodaysTasksViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onOpenDetailsDrawer: (task: Task) => void;
  onAddTask: (newTask: Omit<Task, 'id' | 'activity' | 'subtasks'>) => void;
  onUpdateTask: (task: Task) => void;
}

export const TodaysTasksView: React.FC<TodaysTasksViewProps> = ({
  tasks,
  onToggleComplete,
  onSelectTask,
  onOpenDetailsDrawer,
  onAddTask,
  onUpdateTask,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'high_priority' | 'work' | 'personal' | 'habits'>('all');
  const [quickInput, setQuickInput] = useState('');
  const [selectedTag, setSelectedTag] = useState('#design-system');
  const [dndActive, setDndActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    tasks.find((t) => t.id === 'task-1')?.id || tasks[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');
  const [inlineNewSubtask, setInlineNewSubtask] = useState('');

  // Filter tasks belonging to today
  const todaysTasks = tasks.filter((t) => t.column === 'today' || !t.column);

  const completedCount = todaysTasks.filter((t) => t.status === 'completed').length;
  const totalCount = todaysTasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter by category tabs
  const filteredTasks = todaysTasks.filter((task) => {
    if (activeCategoryTab === 'all') return true;
    if (activeCategoryTab === 'high_priority') return task.priority === 'urgent' || task.priority === 'high';
    if (activeCategoryTab === 'work') return task.category === 'work';
    if (activeCategoryTab === 'personal') return task.category === 'personal';
    if (activeCategoryTab === 'habits') return task.category === 'habits';
    return true;
  });

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || todaysTasks[0];

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    onAddTask({
      title: quickInput.trim(),
      project: 'FlowDo Design System',
      dueDate: 'Oct 24',
      dueTime: '12:00 PM',
      priority: 'high',
      category: 'work',
      tags: [selectedTag],
      status: 'in_progress',
      column: 'today',
    });
    setQuickInput('');
  };

  const handleInlineAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTask) return;
    const commentItem = {
      id: `act-${Date.now()}`,
      user: 'Alex Morgan',
      avatar: 'AM',
      action: replyText.trim(),
      time: 'Just now',
    };
    const updated = {
      ...selectedTask,
      activity: [commentItem, ...selectedTask.activity],
    };
    onUpdateTask(updated);
    setReplyText('');
  };

  const handleInlineAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineNewSubtask.trim() || !selectedTask) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: inlineNewSubtask.trim(),
      completed: false,
    };
    const updated = {
      ...selectedTask,
      subtasks: [...selectedTask.subtasks, newSub],
    };
    onUpdateTask(updated);
    setInlineNewSubtask('');
  };

  const handleInlineToggleSubtask = (subId: string) => {
    if (!selectedTask) return;
    const updated = {
      ...selectedTask,
      subtasks: selectedTask.subtasks.map((s) =>
        s.id === subId ? { ...s, completed: !s.completed } : s
      ),
    };
    onUpdateTask(updated);
  };

  const getPriorityBadgeVariant = (priority: Priority, isHabit?: boolean) => {
    if (isHabit) return 'habit';
    switch (priority) {
      case 'urgent':
        return 'urgent';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8F9FD]">
      {/* Main Task List Column */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-4xl">
        {/* Header Block */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-bold text-[#5C52E5] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>FOCUSED FLOW</span>
                <span>·</span>
                <span className="text-slate-400 font-medium">Sprint Cycle 44</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Today — Thursday, Oct 24
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                Quiet clarity: You've powered through the most critical cognitive lifts.
              </p>
            </div>

            {/* Circular Progress Meter */}
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/70 shrink-0">
              <CircularProgress
                progress={completionPercentage}
                size={52}
                strokeWidth={5}
                color="#5C52E5"
                trackColor="#E2E8F0"
              >
                <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                  {completionPercentage}%
                </span>
              </CircularProgress>
              <div>
                <div className="text-sm font-bold text-slate-800 tabular-nums">
                  {completedCount} of {totalCount}
                </div>
                <div className="text-xs text-slate-500 font-medium">Completed</div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-100 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              All ({todaysTasks.length})
            </button>
            <button
              onClick={() => setActiveCategoryTab('high_priority')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryTab === 'high_priority'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              High Priority (
              {todaysTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length}
              )
            </button>
            <button
              onClick={() => setActiveCategoryTab('work')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryTab === 'work'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Work ({todaysTasks.filter((t) => t.category === 'work').length})
            </button>
            <button
              onClick={() => setActiveCategoryTab('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryTab === 'personal'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Personal ({todaysTasks.filter((t) => t.category === 'personal').length})
            </button>
            <button
              onClick={() => setActiveCategoryTab('habits')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategoryTab === 'habits'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Habits ({todaysTasks.filter((t) => t.category === 'habits').length})
            </button>
          </div>
        </div>

        {/* Quick Task Input Bar */}
        <form
          onSubmit={handleQuickAdd}
          className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-2.5 flex items-center gap-3 transition-focus group focus-within:border-[#5C52E5] focus-within:ring-2 focus-within:ring-[#5C52E5]/15"
        >
          <div className="w-6 h-6 rounded-md bg-[#EEECFC] text-[#5C52E5] flex items-center justify-center font-bold text-xs shrink-0 ml-1">
            +
          </div>
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Press Enter to add task in Scandinavian flow..."
            className="flex-1 text-xs text-slate-800 placeholder:text-slate-400 bg-transparent border-none focus:outline-hidden"
          />
          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <button
              type="button"
              onClick={() =>
                setSelectedTag((prev) =>
                  prev === '#design-system' ? '#operations' : '#design-system'
                )
              }
              className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200/80 transition-colors"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{selectedTag}</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200/80 transition-colors"
            >
              <AtSign className="w-3 h-3 text-slate-400" />
              <span>@Alex</span>
            </button>
          </div>
        </form>

        {/* Tasks List */}
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isSelected = selectedTask?.id === task.id;

            return (
              <div
                key={task.id}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  onSelectTask(task);
                }}
                className={`bg-white rounded-xl border transition-all duration-150 p-4 cursor-pointer select-none group ${
                  isSelected
                    ? 'border-[#5C52E5] ring-2 ring-[#5C52E5]/15 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id);
                    }}
                    className={`mt-0.5 shrink-0 transition-transform active:scale-90 ${
                      isCompleted
                        ? 'text-emerald-500'
                        : 'text-slate-300 hover:text-[#5C52E5]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-100 stroke-[2]" />
                    ) : (
                      <Circle className="w-5 h-5 stroke-[1.8]" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h3
                          className={`text-sm font-bold text-slate-800 group-hover:text-[#5C52E5] transition-colors truncate ${
                            isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* Priority / Status Tag */}
                        {task.priority === 'urgent' && (
                          <Badge variant="urgent">URGENT</Badge>
                        )}
                        {task.priority === 'high' && (
                          <Badge variant="high">HIGH</Badge>
                        )}
                        {task.category === 'habits' && (
                          <Badge variant="habit">HABIT</Badge>
                        )}
                        {task.dueDate === 'Oct 28' && (
                          <Badge variant="warning">DUE OCT 28</Badge>
                        )}
                      </div>

                      {/* Detail drawer button on mobile / quick expand */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetailsDrawer(task);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#5C52E5] rounded transition-opacity"
                        title="Open full drawer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {task.subtitle && (
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isCompleted ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {task.subtitle}
                      </p>
                    )}

                    {/* Metadata strip */}
                    <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400 flex-wrap">
                      <span className="font-medium text-slate-600">
                        {task.project}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {task.dueTime || '11:00 AM'}
                      </span>
                      {task.subtasks.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-500">
                            {task.subtasks.filter((s) => s.completed).length}/
                            {task.subtasks.length} subtasks
                          </span>
                        </>
                      )}
                      {task.tags.map((tag) => (
                        <span key={tag} className="text-slate-400 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Peak Cognitive Window Banner */}
        <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-slate-50 rounded-xl p-4 border border-[#5C52E5]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#5C52E5] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Peak Cognitive Window Active</span>
                {dndActive && (
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.2 rounded-full font-medium">
                    DND Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                You consistently close 85% of deep work tasks between 10 AM and 1 PM.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={dndActive ? 'primary' : 'secondary'}
            onClick={() => setDndActive(!dndActive)}
            icon={<Moon className="w-3.5 h-3.5" />}
          >
            {dndActive ? 'Leave DND' : 'Enter Do Not Disturb'}
          </Button>
        </div>
      </div>

      {/* Right Side Detail Preview Pane (Matching Screen 2) */}
      {selectedTask && (
        <aside className="w-96 border-l border-slate-200/90 bg-white hidden xl:flex flex-col h-full shrink-0 overflow-hidden">
          {/* Top action bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Preview
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-bold text-slate-700 capitalize">
                {selectedTask.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenDetailsDrawer(selectedTask)}
                className="p-1.5 text-slate-400 hover:text-[#5C52E5] hover:bg-slate-100 rounded-md transition-colors"
                title="Expand full screen drawer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pane Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {selectedTask.priority === 'urgent' && (
                  <Badge variant="urgent">URGENT (P1)</Badge>
                )}
                {selectedTask.priority === 'high' && (
                  <Badge variant="high">HIGH PRIORITY</Badge>
                )}
                <span className="text-xs font-medium text-slate-500">
                  {selectedTask.project}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {selectedTask.title}
              </h3>
              {selectedTask.subtitle && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedTask.subtitle}
                </p>
              )}
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Due Time
                </span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {selectedTask.dueDate}, {selectedTask.dueTime || '11:00 AM'}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Assignee
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Avatar name="Alex Morgan" size="xs" />
                  <span className="font-semibold text-slate-800 text-xs">Alex Morgan</span>
                </div>
              </div>
            </div>

            {/* Subtasks */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Subtasks
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedTask.subtasks.filter((s) => s.completed).length}/
                  {selectedTask.subtasks.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {selectedTask.subtasks.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={s.completed}
                      onChange={() => handleInlineToggleSubtask(s.id)}
                      className="rounded border-slate-300 text-[#5C52E5] focus:ring-[#5C52E5]"
                    />
                    <span
                      className={`truncate ${
                        s.completed ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {s.title}
                    </span>
                  </label>
                ))}
              </div>

              <form onSubmit={handleInlineAddSubtask} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={inlineNewSubtask}
                  onChange={(e) => setInlineNewSubtask(e.target.value)}
                  placeholder="+ Add new subtask..."
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white focus:outline-hidden focus:border-[#5C52E5]"
                />
                <Button type="submit" size="xs" variant="secondary">
                  Add
                </Button>
              </form>
            </div>

            {/* Notes & Specs preview */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Notes & Specs
              </span>
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed font-sans">
                {selectedTask.notes ||
                  'Ensure typography scales strictly adhere to the token system. Zero modal jitter during navigation transitions.'}
              </div>
            </div>

            {/* Attachments */}
            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Attachments
                </span>
                {selectedTask.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-[#5C52E5] shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 block truncate">
                          {att.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {att.size || 'File'} {att.updated ? `· ${att.updated}` : ''}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                ))}
              </div>
            )}

            {/* Activity Stream */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Recent Activity
              </span>
              <div className="space-y-2.5">
                {selectedTask.activity.slice(0, 3).map((act) => (
                  <div key={act.id} className="flex items-start gap-2 text-xs">
                    <Avatar name={act.user} size="xs" />
                    <div className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-bold text-slate-800">{act.user}</span>
                        <span className="text-slate-400 text-[10px]">{act.time}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-normal">
                        {act.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleInlineAddComment} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply or note..."
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:bg-white focus:outline-hidden focus:border-[#5C52E5]"
                />
                <Button type="submit" size="xs" variant="primary">
                  <Send className="w-3 h-3" />
                </Button>
              </form>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
