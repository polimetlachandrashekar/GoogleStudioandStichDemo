import React, { useState } from 'react';
import {
  FolderKanban,
  LayoutGrid,
  List,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';
import { Workspace, WorkspaceStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { CircularProgress, ProgressBar } from '../ui/ProgressBar';

export interface ProjectsWorkspacesViewProps {
  workspaces: Workspace[];
  onCreateWorkspace: (workspace: Workspace) => void;
  onSelectWorkspace?: (workspace: Workspace) => void;
}

export const ProjectsWorkspacesView: React.FC<ProjectsWorkspacesViewProps> = ({
  workspaces,
  onCreateWorkspace,
  onSelectWorkspace,
}) => {
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTag, setNewProjectTag] = useState('#engineering');

  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesTag = activeTag === 'all' || ws.category === activeTag || ws.tags.includes(activeTag);
    const matchesSearch =
      ws.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ws.subtitle.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const getStatusBadgeVariant = (status: WorkspaceStatus) => {
    switch (status) {
      case 'in_progress':
        return 'purple';
      case 'on_track':
        return 'success';
      case 'needs_attention':
        return 'warning';
      case 'ongoing':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: newProjectName.trim(),
      subtitle: newProjectDesc.trim() || 'Active initiative roadmap & milestone delivery.',
      status: 'in_progress',
      statusLabel: 'IN PROGRESS',
      progress: 0,
      tasksCount: 1,
      completedCount: 0,
      tags: [newProjectTag, '#q4'],
      category: newProjectTag,
      lastUpdated: 'Just now',
      members: [{ name: 'Alex Morgan', avatar: 'AM' }],
    };

    onCreateWorkspace(newWs);
    setNewProjectName('');
    setNewProjectDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#F8F9FD]">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-[#5C52E5] uppercase tracking-wider mb-1">
              PORTFOLIO OVERVIEW · Q4 SYNCHRONIZED
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Projects & Workspaces
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Orchestrate multidimensional initiatives, balance team velocity, and monitor milestone completion.
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter workspaces..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#5C52E5] focus:outline-hidden"
              />
            </div>

            {/* Grid / Table Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewLayout === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewLayout('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewLayout === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Create New Project
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Summary Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Workspaces
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            4 <span className="text-xs font-normal text-slate-500">Workspaces live</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            ✓ 100% on schedule
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Task Density
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            28 <span className="text-xs font-normal text-slate-500">Total Open</span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium block mt-1">
            8 High Priority in critical path
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Completion Rate
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums flex items-baseline gap-1.5">
            <span>94%</span>
            <span className="text-xs font-semibold text-emerald-600 font-mono">+4%</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Higher than trailing 30 days
          </span>
        </div>

        {/* Metric 4: Team Velocity Index with Sparkline */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Team Velocity Index
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              Optimal
            </div>
            <span className="text-[11px] text-slate-500 font-mono block mt-1">
              78% capacity cap
            </span>
          </div>
          <div className="flex items-end gap-1 h-8 px-1">
            <span className="w-1.5 h-3 bg-indigo-200 rounded-xs" />
            <span className="w-1.5 h-5 bg-indigo-300 rounded-xs" />
            <span className="w-1.5 h-4 bg-indigo-400 rounded-xs" />
            <span className="w-1.5 h-7 bg-[#5C52E5] rounded-xs" />
            <span className="w-1.5 h-6 bg-[#5C52E5] rounded-xs" />
          </div>
        </div>
      </div>

      {/* Main Grid & Side Widget Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Workspaces List/Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tag Filter Pills & Sort */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTag('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTag === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                All ({workspaces.length})
              </button>
              <button
                onClick={() => setActiveTag('#design-system')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTag === '#design-system'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                #design-system
              </button>
              <button
                onClick={() => setActiveTag('#client-ops')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTag === '#client-ops'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                #client-ops
              </button>
              <button
                onClick={() => setActiveTag('#fitness')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTag === '#fitness'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                #fitness
              </button>
              <button
                onClick={() => setActiveTag('#finances')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTag === '#finances'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                #finances
              </button>
            </div>

            <div className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1 font-medium">
              <span>Sorted by:</span>
              <span className="text-slate-700 font-semibold">Velocity</span>
            </div>
          </div>

          {/* Cards Grid */}
          {viewLayout === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => onSelectWorkspace && onSelectWorkspace(ws)}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-4 cursor-pointer select-none group"
                >
                  {/* Status Tag */}
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusBadgeVariant(ws.status)}>
                      {ws.statusLabel}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ws.lastUpdated}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#5C52E5] transition-colors leading-snug">
                      {ws.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {ws.subtitle}
                    </p>
                  </div>

                  {/* Progress and Metric */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 tabular-nums font-mono">
                        {ws.progress}% completed
                      </span>
                      <span className="text-slate-500 font-medium text-[11px]">
                        {ws.completedCount} / {ws.tasksCount} Tasks
                      </span>
                    </div>
                    <ProgressBar progress={ws.progress} height="h-2" />
                    {ws.metricLabel && (
                      <p className="text-[11px] text-slate-500 pt-0.5">
                        {ws.metricLabel}
                      </p>
                    )}
                  </div>

                  {/* Tags and Members Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ws.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] text-slate-400 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center -space-x-1.5">
                      {ws.members.slice(0, 3).map((m, idx) => (
                        <Avatar
                          key={idx}
                          name={m.name}
                          size="xs"
                          className="ring-2 ring-white"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Workspace</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Tasks</th>
                    <th className="py-3 px-4">Members</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkspaces.map((ws) => (
                    <tr
                      key={ws.id}
                      onClick={() => onSelectWorkspace && onSelectWorkspace(ws)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 group-hover:text-[#5C52E5]">
                          {ws.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {ws.subtitle}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(ws.status)}>
                          {ws.statusLabel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <ProgressBar progress={ws.progress} height="h-1.5" className="w-20" />
                          <span className="font-mono text-slate-700 font-semibold">
                            {ws.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {ws.completedCount} / {ws.tasksCount}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center -space-x-1.5">
                          {ws.members.slice(0, 3).map((m, idx) => (
                            <Avatar
                              key={idx}
                              name={m.name}
                              size="xs"
                              className="ring-2 ring-white"
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Activity & Burndown Chart (Matching Screen 3) */}
        <div className="space-y-6">
          {/* Widget 1: Recent Activity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Activity
              </span>
              <button className="text-xs text-[#5C52E5] hover:underline font-semibold">
                Mark read
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Avatar name="Alex Morgan" size="xs" />
                <div className="flex-1">
                  <p className="text-slate-700 leading-normal">
                    <span className="font-bold text-slate-900">Alex Morgan</span> updated token specs in <span className="font-semibold text-[#5C52E5]">FlowDo Design System</span>.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">14 minutes ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Avatar name="You" size="xs" />
                <div className="flex-1">
                  <p className="text-slate-700 leading-normal">
                    You logged 45m zone 2 cardio in <span className="font-semibold text-teal-600">Personal Health & Habits</span>.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">1 hour ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                  !
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 leading-normal">
                    <span className="font-bold text-rose-700">Warning tag raised</span> on Client Freelance Handover (Oct 30 hard gate).
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">3 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Avatar name="Auto Sync" size="xs" />
                <div className="flex-1">
                  <p className="text-slate-700 leading-normal">
                    Automated sync complete for monthly expense audits in <span className="font-semibold text-slate-800">Home & Life Admin</span>.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Yesterday at 18:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 2: Weekly Velocity Burndown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Weekly Velocity Burndown
              </span>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                +18% Peak
              </span>
            </div>

            {/* Bar Chart */}
            <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1 border-b border-slate-100 pb-2">
              {[
                { day: 'Mon', h: 48, count: 6 },
                { day: 'Tue', h: 64, count: 8 },
                { day: 'Wed', h: 52, count: 7 },
                { day: 'Thu', h: 88, count: 11, current: true },
                { day: 'Fri', h: 36, count: 5 },
                { day: 'Sat', h: 24, count: 3 },
                { day: 'Sun', h: 18, count: 2 },
              ].map((col) => (
                <div key={col.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {col.count}
                  </span>
                  <div
                    style={{ height: `${col.h}%` }}
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                      col.current
                        ? 'bg-[#5C52E5] shadow-xs'
                        : 'bg-indigo-100 hover:bg-indigo-200'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      col.current ? 'text-[#5C52E5] font-bold' : 'text-slate-400'
                    }`}
                  >
                    {col.day}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Optimal completed milestones to preserve peak responsiveness latency.
            </p>
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10 border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create New Project</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project / Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., Mobile App Redesign"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#5C52E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Goals
                </label>
                <textarea
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Summarize initiative goals..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#5C52E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={newProjectTag}
                  onChange={(e) => setNewProjectTag(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#5C52E5]"
                >
                  <option value="#design-system">#design-system</option>
                  <option value="#client-ops">#client-ops</option>
                  <option value="#engineering">#engineering</option>
                  <option value="#fitness">#fitness</option>
                  <option value="#finances">#finances</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Workspace
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
