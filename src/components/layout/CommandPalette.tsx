import React, { useState, useEffect } from 'react';
import { Search, CheckSquare, Calendar, FolderKanban, Settings, ArrowRight, X } from 'lucide-react';
import { Task, Workspace, NavigationTab } from '../../types';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  workspaces: Workspace[];
  onSelectTask: (task: Task) => void;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenNewTaskModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  workspaces,
  onSelectTask,
  onSelectTab,
  onOpenNewTaskModal,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.project.toLowerCase().includes(query.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(query.toLowerCase()) ||
    w.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full z-10 border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, projects..."
            className="w-full text-sm py-4 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Actions & Views
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onOpenNewTaskModal();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-[#EEECFC] hover:text-[#5C52E5] rounded-lg transition-colors font-medium text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-[#5C52E5]">
                    +
                  </span>
                  <span>Create New Task</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Shift+N</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('today');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  <span>Go to Today's Tasks</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onSelectTab('schedule');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Go to Upcoming Schedule</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onSelectTab('projects');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 text-slate-400" />
                  <span>Go to Projects & Workspaces</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onSelectTab('settings');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Go to Settings & Preferences</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Tasks ({filteredTasks.length})
              </div>
              <div className="space-y-0.5">
                {filteredTasks.slice(0, 5).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTask(t);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-900 truncate group-hover:text-[#5C52E5]">
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {t.project} · {t.dueDate}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono capitalize">
                      {t.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Workspaces Results */}
          {filteredWorkspaces.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Workspaces ({filteredWorkspaces.length})
              </div>
              <div className="space-y-0.5">
                {filteredWorkspaces.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      onSelectTab('projects');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
                  >
                    <div className="font-semibold text-slate-900 truncate">
                      {w.name}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {w.progress}% completed
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search navigation, tasks & projects</span>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
