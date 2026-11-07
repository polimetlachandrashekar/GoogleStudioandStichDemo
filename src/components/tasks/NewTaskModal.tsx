import React, { useState } from 'react';
import { X, Calendar, Flag, Folder, Tag } from 'lucide-react';
import { Task, Priority, TaskCategory } from '../../types';
import { Button } from '../ui/Button';

export interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (newTask: Omit<Task, 'id' | 'activity' | 'subtasks'>) => void;
  availableProjects?: string[];
  defaultColumn?: 'today' | 'tomorrow' | 'weekend' | 'nextWeek';
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  availableProjects = [
    'FlowDo Design System',
    'Personal Health & Habits',
    'Client Freelance Handover',
    'Home & Life Admin',
  ],
  defaultColumn = 'today',
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [project, setProject] = useState(availableProjects[0]);
  const [priority, setPriority] = useState<Priority>('high');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [dueDate, setDueDate] = useState('Oct 25');
  const [dueTime, setDueTime] = useState('11:00 AM');
  const [tagsInput, setTagsInput] = useState('#design-system');
  const [column, setColumn] = useState<'today' | 'tomorrow' | 'weekend' | 'nextWeek'>(defaultColumn);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    onCreateTask({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      project,
      priority,
      category,
      dueDate,
      dueTime,
      status: 'in_progress',
      tags,
      column,
    });

    setTitle('');
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EEECFC] text-[#5C52E5] flex items-center justify-center font-bold text-sm">
              +
            </div>
            <h2 className="text-sm font-bold text-slate-900">Create New Task</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Audit dark mode contrast and responsive breakpoints"
              className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#5C52E5] focus:ring-2 focus:ring-[#5C52E5]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Summary / Outcome (Optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g., Prepare walkthrough screens & token export for team"
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#5C52E5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                <span>Workspace</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:border-[#5C52E5]"
              >
                {availableProjects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:border-[#5C52E5]"
              >
                <option value="urgent">Urgent (P1)</option>
                <option value="high">High Priority (P2)</option>
                <option value="medium">Medium Priority (P3)</option>
                <option value="low">Low Priority (P4)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Due Date</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="Oct 25"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:border-[#5C52E5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Destination View
              </label>
              <select
                value={column}
                onChange={(e) =>
                  setColumn(e.target.value as 'today' | 'tomorrow' | 'weekend' | 'nextWeek')
                }
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:border-[#5C52E5]"
              >
                <option value="today">Today's Tasks</option>
                <option value="tomorrow">Tomorrow (Schedule)</option>
                <option value="weekend">This Weekend (Schedule)</option>
                <option value="nextWeek">Next Week (Schedule)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Tags (Space separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#design-system #tokens #review"
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#5C52E5]"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
