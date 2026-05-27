'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useSettings } from '@/hooks/useSettings'

export default function SettingsPage() {
  const {
    settings,
    isLoading,
    isUpdating,
    updateSettings,
    updateNotificationSettings,
    updateSchedulingMode,
    updateAISettings,
    updateWorkloadSettings,
  } = useSettings()

  const [localSettings, setLocalSettings] = useState<any>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings((prev: any) => ({ ...prev, [key]: value }))
    setSaveSuccess(false)
  }

  const handleSaveWorkloadSettings = async () => {
    try {
      await updateWorkloadSettings(
        localSettings.fairness_priority_level,
        localSettings.workload_balancing_strength,
        localSettings.max_assignments_per_week
      )
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const handleSaveNotificationSettings = async () => {
    try {
      await updateNotificationSettings(
        localSettings.whatsapp_enabled,
        localSettings.sms_fallback_enabled,
        localSettings.email_alerts_enabled
      )
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const handleSaveSchedulingMode = async () => {
    try {
      await updateSchedulingMode(localSettings.scheduling_mode)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const handleSaveAISettings = async () => {
    try {
      await updateAISettings(
        localSettings.ai_suggestions_enabled,
        localSettings.ai_predictive_scheduling_enabled,
        localSettings.ai_burnout_detection_enabled
      )
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Navigation />
        <main className="flex-1 lg:ml-64">
          <Header title="Settings" description="Configure system behavior" />
          <div className="p-8 text-center text-gray-600">Loading settings...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Settings" description="Configure system behavior and notifications" />

        <div className="p-8">
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Settings saved successfully
            </div>
          )}

          <div className="space-y-8">
            {/* Workload & Fairness Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Workload & Fairness</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fairness Priority
                  </label>
                  <select
                    value={localSettings?.fairness_priority_level || 'medium'}
                    onChange={(e) => handleSettingChange('fairness_priority_level', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low - Allow some imbalance</option>
                    <option value="medium">Medium - Balanced approach</option>
                    <option value="high">High - Strict fairness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workload Balancing Strength ({localSettings?.workload_balancing_strength || 5}/10)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={localSettings?.workload_balancing_strength || 5}
                    onChange={(e) =>
                      handleSettingChange('workload_balancing_strength', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Assignments Per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={localSettings?.max_assignments_per_week || 7}
                    onChange={(e) =>
                      handleSettingChange('max_assignments_per_week', parseInt(e.target.value))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleSaveWorkloadSettings}
                  disabled={isUpdating}
                  className={`px-6 py-2 rounded-lg text-white transition ${
                    isUpdating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isUpdating ? 'Saving...' : 'Save Workload Settings'}
                </button>
              </div>
            </div>

            {/* Scheduling Mode */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Scheduling Mode</h2>
              <div className="space-y-3 mb-6">
                {['fully_automatic', 'semi_automatic', 'manual_approval'].map((mode) => (
                  <label key={mode} className="flex items-center">
                    <input
                      type="radio"
                      name="scheduling_mode"
                      value={mode}
                      checked={localSettings?.scheduling_mode === mode}
                      onChange={(e) =>
                        handleSettingChange('scheduling_mode', e.target.value)
                      }
                      className="w-4 h-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {mode === 'fully_automatic'
                        ? 'Fully Automatic - System decides assignments'
                        : mode === 'semi_automatic'
                          ? 'Semi Automatic - Review before approval'
                          : 'Manual Approval - Admin reviews all'}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleSaveSchedulingMode}
                disabled={isUpdating}
                className={`px-6 py-2 rounded-lg text-white transition ${
                  isUpdating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUpdating ? 'Saving...' : 'Save Scheduling Mode'}
              </button>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>
              <div className="space-y-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings?.whatsapp_enabled || false}
                    onChange={(e) =>
                      handleSettingChange('whatsapp_enabled', e.target.checked)
                    }
                    className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Enable WhatsApp notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings?.sms_fallback_enabled || false}
                    onChange={(e) =>
                      handleSettingChange('sms_fallback_enabled', e.target.checked)
                    }
                    className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Enable SMS fallback</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings?.email_alerts_enabled || false}
                    onChange={(e) =>
                      handleSettingChange('email_alerts_enabled', e.target.checked)
                    }
                    className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Enable email alerts</span>
                </label>
              </div>
              <button
                onClick={handleSaveNotificationSettings}
                disabled={isUpdating}
                className={`px-6 py-2 rounded-lg text-white transition ${
                  isUpdating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUpdating ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </div>

            {/* AI Settings (Future-ready) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">AI Features (Future)</h2>
              <div className="space-y-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings?.ai_suggestions_enabled || false}
                    onChange={(e) =>
                      handleSettingChange('ai_suggestions_enabled', e.target.checked)
                    }
                    className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">AI Suggestions</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings?.ai_predictive_scheduling_enabled || false}
                    onChange={(e) =>
                      handleSettingChange('ai_predictive_scheduling_enabled', e.target.checked)
                    }
                    className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Predictive Scheduling</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings?.ai_burnout_detection_enabled || false}
                    onChange={(e) =>
                      handleSettingChange('ai_burnout_detection_enabled', e.target.checked)
                    }
                    className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Burnout Detection</span>
                </label>
              </div>
              <button
                onClick={handleSaveAISettings}
                disabled={isUpdating}
                className={`px-6 py-2 rounded-lg text-white transition ${
                  isUpdating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUpdating ? 'Saving...' : 'Save AI Settings'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
