/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { initialTasks, initialWorkspaces, initialUserSettings } from './data/initialData';
import { Task, Workspace, UserSettings, NavigationTab } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { CommandPalette } from './components/layout/CommandPalette';
import { TaskDetailsDrawer } from './components/tasks/TaskDetailsDrawer';
import { NewTaskModal } from './components/tasks/NewTaskModal';
import { TodaysTasksView } from './components/views/TodaysTasksView';
import { UpcomingScheduleView } from './components/views/UpcomingScheduleView';
import { ProjectsWorkspacesView } from './components/views/ProjectsWorkspacesView';
import { SettingsPreferencesView } from './components/views/SettingsPreferencesView';
import { soundFx } from './utils/sound';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('today');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [userSettings, setUserSettings] = useState<UserSettings>(initialUserSettings);

  // Modals and Drawer state
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskDefaultColumn, setNewTaskDefaultColumn] = useState<
    'today' | 'tomorrow' | 'weekend' | 'nextWeek'
  >('today');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [autoBalanceApplied, setAutoBalanceApplied] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Shift + N for New Task
      if (e.shiftKey && e.key.toUpperCase() === 'N' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setNewTaskDefaultColumn('today');
        setIsNewTaskModalOpen(true);
      }
      // ESC closes drawer or modals
      if (e.key === 'Escape') {
        if (isDrawerOpen) setIsDrawerOpen(false);
        if (isNewTaskModalOpen) setIsNewTaskModalOpen(false);
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, isNewTaskModalOpen, isCommandPaletteOpen]);

  // Toggle Task Completion Handler
  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const current = prevTasks[taskIndex];
      const willBeCompleted = current.status !== 'completed';

      // Play audio feedback if soundFx enabled in settings
      if (willBeCompleted && userSettings.notifications.soundFx) {
        soundFx.playWoodblock();
      }

      // Trigger celebratory confetti for urgent or milestone tasks
      if (willBeCompleted && (current.priority === 'urgent' || current.priority === 'high')) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#5C52E5', '#7B73F3', '#10B981', '#F59E0B'],
          });
        } catch {
          // Fallback if canvas-confetti is not loaded
        }
      }

      const updatedTask: Task = {
        ...current,
        status: willBeCompleted ? 'completed' : 'in_progress',
      };

      const updatedList = [...prevTasks];
      updatedList[taskIndex] = updatedTask;

      // Keep drawer in sync if open
      if (selectedTaskForDrawer?.id === taskId) {
        setSelectedTaskForDrawer(updatedTask);
      }

      return updatedList;
    });
  }, [userSettings.notifications.soundFx, selectedTaskForDrawer]);

  // Update Task Handler
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    if (selectedTaskForDrawer?.id === updatedTask.id) {
      setSelectedTaskForDrawer(updatedTask);
    }
  };

  // Delete Task Handler
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskForDrawer?.id === taskId) {
      setIsDrawerOpen(false);
      setSelectedTaskForDrawer(null);
    }
  };

  // Add Task Handler
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'activity' | 'subtasks'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      subtasks: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          user: userSettings.profile.name,
          avatar: userSettings.profile.avatar,
          action: 'Created task via quick capture.',
          time: 'Just now',
        },
      ],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Apply Auto-Balance smart schedule rearrangement
  const handleApplyAutoBalance = () => {
    setAutoBalanceApplied(true);
    setTasks((prev) =>
      prev.map((t) => {
        // Move Calendar Micro-interaction Specs from Tomorrow to Monday
        if (t.id === 'sched-2') {
          return {
            ...t,
            column: 'nextWeek',
            dueDate: 'Oct 28',
            dueTime: 'Mon, Oct 28 · 09:30 AM',
          };
        }
        return t;
      })
    );

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5C52E5', '#3B82F6', '#10B981'],
      });
    } catch {
      // safe fallback
    }
  };

  // Open task drawer
  const handleOpenDetailsDrawer = (task: Task) => {
    setSelectedTaskForDrawer(task);
    setIsDrawerOpen(true);
  };

  // Sidebar count metrics
  const counts = {
    today: tasks.filter((t) => t.column === 'today' && t.status !== 'completed').length,
    starred: 3,
    highPriority: tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length,
    work: tasks.filter((t) => t.category === 'work').length,
    personal: tasks.filter((t) => t.category === 'personal').length,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FD] text-slate-800 font-sans">
      {/* 1. Global Persistent Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        userSettings={userSettings}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* 2. Top Action Header */}
        <TopHeader
          currentTab={currentTab}
          onOpenNewTaskModal={() => {
            setNewTaskDefaultColumn('today');
            setIsNewTaskModalOpen(true);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOptimizeSchedule={handleApplyAutoBalance}
          userSettings={userSettings}
        />

        {/* 3. View Port Content Switcher */}
        <main className="flex-1 flex overflow-hidden">
          {currentTab === 'today' && (
            <TodaysTasksView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onSelectTask={(task) => {
                setSelectedTaskForDrawer(task);
              }}
              onOpenDetailsDrawer={handleOpenDetailsDrawer}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {currentTab === 'schedule' && (
            <UpcomingScheduleView
              tasks={tasks}
              onSelectTask={handleOpenDetailsDrawer}
              onOpenDetailsDrawer={handleOpenDetailsDrawer}
              onToggleComplete={handleToggleComplete}
              onOpenNewTaskModal={(column) => {
                setNewTaskDefaultColumn(column || 'tomorrow');
                setIsNewTaskModalOpen(true);
              }}
              onApplyAutoBalance={handleApplyAutoBalance}
              autoBalanceApplied={autoBalanceApplied}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsWorkspacesView
              workspaces={workspaces}
              onCreateWorkspace={(newWs) =>
                setWorkspaces((prev) => [newWs, ...prev])
              }
              onSelectWorkspace={(ws) => {
                // Navigate to today filtered or show details
                setCurrentTab('today');
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPreferencesView
              settings={userSettings}
              onSaveSettings={setUserSettings}
            />
          )}
        </main>
      </div>

      {/* 4. Slide-out Task Details Drawer (Screen 5) */}
      <TaskDetailsDrawer
        task={selectedTaskForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        availableProjects={workspaces.map((w) => w.name)}
      />

      {/* 5. Create New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onCreateTask={handleAddTask}
        availableProjects={workspaces.map((w) => w.name)}
        defaultColumn={newTaskDefaultColumn}
      />

      {/* 6. Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        workspaces={workspaces}
        onSelectTask={(task) => {
          handleOpenDetailsDrawer(task);
        }}
        onSelectTab={setCurrentTab}
        onOpenNewTaskModal={() => {
          setNewTaskDefaultColumn('today');
          setIsNewTaskModalOpen(true);
        }}
      />
    </div>
  );
}
