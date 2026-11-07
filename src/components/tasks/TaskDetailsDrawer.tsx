import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Calendar,
  Clock,
  Check,
  Plus,
  Trash2,
  FileText,
  Paperclip,
  Send,
  ExternalLink,
  Flame,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { Task, Subtask, Priority } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/ProgressBar';

export interface TaskDetailsDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  availableProjects?: string[];
}

export const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  availableProjects = [
    'FlowDo Design System',
    'Personal Health & Habits',
    'Client Freelance Handover',
    'Home & Life Admin',
  ],
}) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(task);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCurrentTask(task);
    setIsSaved(false);
  }, [task]);

  if (!isOpen || !currentTask) return null;

  const completedSubtasks = currentTask.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = currentTask.subtasks.length;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleToggleSubtask = (subtaskId: string) => {
    if (!currentTask) return;
    const updatedSubtasks = currentTask.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    const updated = { ...currentTask, subtasks: updatedSubtasks };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !currentTask) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    const updated = {
      ...currentTask,
      subtasks: [...currentTask.subtasks, newSub],
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subId: string) => {
    if (!currentTask) return;
    const updated = {
      ...currentTask,
      subtasks: currentTask.subtasks.filter((s) => s.id !== subId),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentTask) return;
    const commentItem = {
      id: `comment-${Date.now()}`,
      user: 'Alex Morgan',
      avatar: 'AM',
      action: newComment.trim(),
      time: 'Just now',
    };
    const updated = {
      ...currentTask,
      activity: [commentItem, ...currentTask.activity],
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setNewComment('');
  };

  const handleSave = () => {
    if (currentTask) {
      onUpdateTask(currentTask);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Task Details
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {onDeleteTask && (
              <button
                onClick={() => {
                  onDeleteTask(currentTask.id);
                  onClose();
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Main Title & Status */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleComplete(currentTask.id)}
                className={`mt-1 shrink-0 transition-transform active:scale-90 ${
                  currentTask.status === 'completed'
                    ? 'text-emerald-500'
                    : 'text-slate-300 hover:text-[#5C52E5]'
                }`}
              >
                {currentTask.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
                ) : (
                  <Circle className="w-6 h-6 stroke-[1.75]" />
                )}
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={currentTask.title}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, title: e.target.value })
                  }
                  className={`w-full text-lg font-bold text-slate-900 border-none p-0 focus:ring-0 focus:outline-hidden ${
                    currentTask.status === 'completed'
                      ? 'line-through text-slate-400'
                      : ''
                  }`}
                  placeholder="Task title..."
                />
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentTask.status === 'completed'
                    ? 'Task marked completed'
                    : 'Tap circle to mark completed when done'}
                </p>
              </div>
            </div>

            {/* Subtitle / Description */}
            <input
              type="text"
              value={currentTask.subtitle || ''}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, subtitle: e.target.value })
              }
              placeholder="Add short summary or outcome..."
              className="w-full text-xs text-slate-600 border-none p-0 focus:ring-0 focus:outline-hidden placeholder:text-slate-400"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Project / Workspace
              </span>
              <select
                value={currentTask.project}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, project: e.target.value })
                }
                className="bg-white font-medium text-slate-700 px-2 py-1 rounded border border-slate-200 focus:outline-hidden focus:border-[#5C52E5] text-xs w-full"
              >
                {availableProjects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Priority
              </span>
              <select
                value={currentTask.priority}
                onChange={(e) =>
                  setCurrentTask({
                    ...currentTask,
                    priority: e.target.value as Priority,
                  })
                }
                className="bg-white font-medium text-slate-700 px-2 py-1 rounded border border-slate-200 focus:outline-hidden focus:border-[#5C52E5] text-xs w-full"
              >
                <option value="urgent">Urgent (P1)</option>
                <option value="high">High Priority (P2)</option>
                <option value="medium">Medium Priority (P3)</option>
                <option value="low">Low Priority (P4)</option>
              </select>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Due Date & Time
              </span>
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={currentTask.dueDate}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, dueDate: e.target.value })
                  }
                  className="bg-white px-2 py-1 rounded border border-slate-200 w-24 text-xs font-medium"
                />
                <input
                  type="text"
                  value={currentTask.dueTime || '11:00 AM'}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, dueTime: e.target.value })
                  }
                  className="bg-white px-2 py-1 rounded border border-slate-200 w-24 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Assignee
              </span>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
                <Avatar name="Alex Morgan" size="xs" />
                <span className="font-semibold text-slate-800 text-xs">Alex Morgan</span>
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Subtasks
                </span>
                <span className="text-xs text-slate-400 font-medium tabular-nums">
                  {completedSubtasks} of {totalSubtasks} completed
                </span>
              </div>
              <span className="text-xs font-bold text-[#5C52E5] tabular-nums font-mono">
                {progressPercent}%
              </span>
            </div>

            <ProgressBar progress={progressPercent} height="h-1.5" />

            {/* Checklist */}
            <div className="space-y-1.5 pt-1">
              {currentTask.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between group px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#5C52E5] focus:ring-[#5C52E5] cursor-pointer"
                    />
                    <span
                      className={`text-xs ${
                        sub.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-700'
                      } truncate`}
                    >
                      {sub.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 p-1 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Add a new subtask..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:border-[#5C52E5] focus:outline-hidden"
              />
              <Button type="submit" size="xs" variant="secondary">
                Add
              </Button>
            </form>
          </div>

          {/* Notes & Markdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Notes & Specs
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Markdown supported</span>
            </div>
            <textarea
              rows={4}
              value={currentTask.notes || ''}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, notes: e.target.value })
              }
              placeholder="Write specifications, token constraints, or meeting links..."
              className="w-full text-xs text-slate-700 bg-slate-50/70 border border-slate-200 rounded-lg p-3 focus:bg-white focus:border-[#5C52E5] focus:ring-1 focus:ring-[#5C52E5]/20 focus:outline-hidden leading-relaxed resize-none"
            />
          </div>

          {/* Attachments Section */}
          {currentTask.attachments && currentTask.attachments.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Attachments ({currentTask.attachments.length})
              </span>
              <div className="space-y-1.5">
                {currentTask.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-[#EEECFC] text-[#5C52E5] flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 truncate block">
                          {att.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {att.size || 'Attachment'} {att.updated ? `· ${att.updated}` : ''}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity & Feedback */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Activity & Feedback
            </span>

            {/* Comment composer */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply or note..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:border-[#5C52E5] focus:outline-hidden"
              />
              <Button type="submit" size="sm" variant="primary">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>

            {/* Feed list */}
            <div className="space-y-3 pt-1">
              {currentTask.activity.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <Avatar name={item.user} size="xs" />
                  <div className="flex-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">
                        {item.user}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            {isSaved ? '✓ Changes saved' : 'Press save to commit changes'}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
