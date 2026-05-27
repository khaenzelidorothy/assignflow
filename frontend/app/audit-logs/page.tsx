'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useAuditLogs } from '@/hooks/useAuditLogs'

export default function AuditLogsPage() {
  const { logs, isLoading, getActionDescription, getChangeDetails } = useAuditLogs()
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
  const [filterAction, setFilterAction] = useState<string>('')

  const filteredLogs = filterAction ? logs.filter((log) => log.action === filterAction) : logs

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Audit Logs" description="Track system actions and changes for transparency" />

        <div className="p-8">
          {/* Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Action</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
            >
              <option value="">All Actions</option>
              <option value="schedule_generated">Schedule Generated</option>
              <option value="assignment_changed">Assignment Changed</option>
              <option value="member_created">Member Created</option>
              <option value="member_updated">Member Updated</option>
              <option value="member_deleted">Member Deleted</option>
              <option value="schedule_published">Schedule Published</option>
              <option value="schedule_locked">Schedule Locked</option>
            </select>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-600">Loading audit logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No audit logs found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Entity Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b hover:bg-gray-50 cursor-pointer transition"
                        onClick={() =>
                          setExpandedLogId(expandedLogId === log.id ? null : log.id)
                        }
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {log.user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getActionDescription(log)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {log.entity_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                          {Object.keys(getChangeDetails(log)).length > 0 ? 'View changes' : 'No changes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Change Details Modal-like Section */}
          {expandedLogId && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow border-l-4 border-blue-500">
              {logs
                .filter((log) => log.id === expandedLogId)
                .map((log) => {
                  const changes = getChangeDetails(log)
                  return (
                    <div key={log.id}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Change Details for {log.entity_id}
                      </h3>
                      {Object.keys(changes).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(changes).map(([key, { from, to }]) => (
                            <div key={key} className="p-3 bg-gray-50 rounded">
                              <p className="font-medium text-gray-900">{key}</p>
                              <p className="text-sm text-gray-600">
                                <strong>From:</strong> {JSON.stringify(from)}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>To:</strong> {JSON.stringify(to)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No detailed changes recorded</p>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
