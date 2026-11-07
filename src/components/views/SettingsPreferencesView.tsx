import React, { useState } from 'react';
import {
  User,
  Sliders,
  Bell,
  Palette,
  Calendar,
  Command,
  Check,
  Volume2,
  Clock,
  Sparkles,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { UserSettings } from '../../types';
import { Button } from '../ui/Button';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Avatar } from '../ui/Avatar';
import { soundFx } from '../../utils/sound';

export interface SettingsPreferencesViewProps {
  settings: UserSettings;
  onSaveSettings: (updated: UserSettings) => void;
}

export const SettingsPreferencesView: React.FC<SettingsPreferencesViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'account'
    | 'productivity'
    | 'notifications'
    | 'appearance'
    | 'integrations'
    | 'shortcuts'
  >('account');

  const [formData, setFormData] = useState<UserSettings>(settings);
  const [saveToast, setSaveToast] = useState(false);

  const handleToggle = (path: string, value: boolean) => {
    const updated = { ...formData };
    if (path === 'naturalLanguageParsing') {
      updated.productivity.naturalLanguageParsing = value;
    } else if (path === 'autoRescheduleOverdue') {
      updated.productivity.autoRescheduleOverdue = value;
    } else if (path === 'dailySmartDigest') {
      updated.notifications.dailySmartDigest = value;
    } else if (path === 'highPriorityAlerts') {
      updated.notifications.highPriorityAlerts = value;
    } else if (path === 'soundFx') {
      updated.notifications.soundFx = value;
      if (value) soundFx.playWoodblock();
    }
    setFormData(updated);
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleDiscard = () => {
    setFormData(settings);
  };

  const navTabs = [
    { id: 'account', label: 'Account & Profile', icon: <User className="w-4 h-4" /> },
    { id: 'productivity', label: 'Productivity Defaults', icon: <Sliders className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications & Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance & Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'integrations', label: 'Calendar & Integrations', icon: <Calendar className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Shortcuts & Command', icon: <Command className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#F8F9FD]">
      {/* Settings Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-[#5C52E5] uppercase tracking-wider mb-1">
              WORKSPACE · PREFERENCES
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Settings & Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Configure your productivity defaults, calendar sync telemetry, and daily flow automation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-200 shrink-0">
            <Avatar name={formData.profile.name} size="sm" status="online" />
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 block">
                {formData.profile.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {formData.profile.email}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#5C52E5] bg-[#EEECFC] px-1.5 py-0.5 rounded ml-1">
              PRO
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Split: Navigation Sidebar + Configuration Pane */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Settings Tabs */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs space-y-1">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#5C52E5] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Flow Engine Status Box (Matching Screen 4) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#5C52E5]" />
                Flow Engine v2.2
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Daily focus score recalculated every midnight. Adaptive rest periods enabled.
            </p>
            <div className="pt-1 text-[10px] font-mono text-slate-400 border-t border-slate-100 flex items-center justify-between">
              <span>Sync Status</span>
              <span className="text-emerald-600 font-semibold">Realtime Active</span>
            </div>
          </div>
        </div>

        {/* Right Settings Configuration Content (Span 3 Cols) */}
        <div className="md:col-span-3 space-y-6">
          {/* Section 1: Account & Profile */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Account & Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your personal identification, operations timezone, and focus cycles.
              </p>
            </div>

            {/* Avatar & Photo Row */}
            <div className="flex items-center gap-5 p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
              <Avatar name={formData.profile.name} size="xl" />
              <div className="space-y-1.5 flex-1">
                <div className="text-xs font-bold text-slate-800">
                  Avatar & Photo
                </div>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  Supported formats: JPG, PNG, WebP (Max 5MB). High-resolution square recommended.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="xs"
                    icon={<Upload className="w-3 h-3" />}
                    onClick={() => {
                      const newName = prompt('Enter display name initials or name:', formData.profile.name);
                      if (newName) {
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, name: newName },
                        });
                      }
                    }}
                  >
                    Upload New
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, avatar: 'AM' },
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.profile.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, name: e.target.value },
                    })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#5C52E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.profile.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, email: e.target.value },
                    })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#5C52E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Timezone
                </label>
                <select
                  value={formData.profile.timezone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, timezone: e.target.value },
                    })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#5C52E5]"
                >
                  <option value="Europe/Stockholm (GMT+1) - Central European Time">
                    Europe/Stockholm (GMT+1) - Central European Time
                  </option>
                  <option value="America/New_York (GMT-5) - Eastern Time">
                    America/New_York (GMT-5) - Eastern Time
                  </option>
                  <option value="America/Los_Angeles (GMT-8) - Pacific Time">
                    America/Los_Angeles (GMT-8) - Pacific Time
                  </option>
                  <option value="Asia/Tokyo (GMT+9) - Japan Standard Time">
                    Asia/Tokyo (GMT+9) - Japan Standard Time
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Working Windows
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.profile.workingHoursStart}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          workingHoursStart: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="text"
                    value={formData.profile.workingHoursEnd}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: {
                          ...formData.profile,
                          workingHoursEnd: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Productivity Defaults */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Productivity Defaults
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Streamline task ingestion logic and intelligent time parsing parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Destination Project
                </label>
                <select
                  value={formData.productivity.defaultProject}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productivity: {
                        ...formData.productivity,
                        defaultProject: e.target.value,
                      },
                    })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#5C52E5]"
                >
                  <option value="Inbox (Default Queue)">Inbox (Default Queue)</option>
                  <option value="FlowDo Design System">FlowDo Design System</option>
                  <option value="Personal Health & Habits">Personal Health & Habits</option>
                  <option value="Client Freelance Handover">Client Freelance Handover</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Reminder Lead Time
                </label>
                <select
                  value={formData.productivity.reminderLeadTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productivity: {
                        ...formData.productivity,
                        reminderLeadTime: e.target.value,
                      },
                    })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-[#5C52E5]"
                >
                  <option value="5 minutes prior">5 minutes prior</option>
                  <option value="15 minutes prior">15 minutes prior</option>
                  <option value="30 minutes prior">30 minutes prior</option>
                  <option value="1 hour prior">1 hour prior</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <ToggleSwitch
                label="Natural Language Date & Priority Parsing"
                description="Automatically extracts deadlines, projects, and urgency from quick capture input (e.g., 'Review slides tomorrow at 3pm #sales High')."
                checked={formData.productivity.naturalLanguageParsing}
                onChange={(checked) =>
                  handleToggle('naturalLanguageParsing', checked)
                }
              />

              <ToggleSwitch
                label="Auto-Reschedule Overdue Tasks"
                description="Roll incomplete low-priority items forward to 'Today' during the morning reset cycle without breaking continuous streaks."
                checked={formData.productivity.autoRescheduleOverdue}
                onChange={(checked) =>
                  handleToggle('autoRescheduleOverdue', checked)
                }
              />
            </div>
          </div>

          {/* Section 3: Notifications & Reminders */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Notifications & Reminders
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define interruption channels to maintain unbroken deep focus intervals.
              </p>
            </div>

            <div className="space-y-4">
              <ToggleSwitch
                label="Daily Smart Digest"
                description="Concise executive summary of baseline perspective sent at 08:00 AM."
                checked={formData.notifications.dailySmartDigest}
                onChange={(checked) => handleToggle('dailySmartDigest', checked)}
              />

              <ToggleSwitch
                label="High Priority Alerts"
                description="Immediate system notifications bypassing silent mode for P1 deadlines."
                checked={formData.notifications.highPriorityAlerts}
                onChange={(checked) => handleToggle('highPriorityAlerts', checked)}
              />

              <div className="flex items-start justify-between gap-4">
                <ToggleSwitch
                  label="Sound FX & Haptics"
                  description="Subtle Nordic woodblock acoustic feedback upon task completion."
                  checked={formData.notifications.soundFx}
                  onChange={(checked) => handleToggle('soundFx', checked)}
                />
                <button
                  type="button"
                  onClick={() => soundFx.playWoodblock()}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#5C52E5] bg-[#EEECFC] hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Preview Chime</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Keyboard Shortcuts */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Keyboard Shortcuts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control the entire workflow without touching the mouse.
                </p>
              </div>
              <button className="text-xs font-semibold text-[#5C52E5] hover:underline">
                Open Cheat Sheet
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Quick Capture
                  </span>
                  <span className="text-[10px] text-slate-400">Global modal anywhere</span>
                </div>
                <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-700 shadow-2xs">
                  ⌘ + K
                </kbd>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    New Task
                  </span>
                  <span className="text-[10px] text-slate-400">Modal shortcut</span>
                </div>
                <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-700 shadow-2xs">
                  Shift + N
                </kbd>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Complete Selected
                  </span>
                  <span className="text-[10px] text-slate-400">Toggle check state</span>
                </div>
                <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-700 shadow-2xs">
                  Space
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar (Matching Screen 4) */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-lg flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            {saveToast
              ? '✓ Changes published successfully!'
              : 'Changes persist automatically · Click save to publish'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={handleDiscard}>
            Discard
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
