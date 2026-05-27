'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'

export default function AuditLogsPage() {
  const [logs] = useState([
    { id: 1, timestamp: '2024-05-27 14:32', actor: 'John Admin', action: 'schedule_published', entity: 'Schedule #42', status: 'success' },
    { id: 2, timestamp: '2024-05-27 14:15', actor: 'Jane Manager', action: 'assignment_modified', entity: 'Assignment #128', status: 'success' },
    { id: 3, timestamp: '2024-05-27 13:48', actor: 'Bob Organizer', action: 'rules_updated', entity: 'Organization Rules', status: 'success' },
    { id: 4, timestamp: '2024-05-27 13:20', actor: 'Sarah Member', action: 'availability_submitted', entity: 'Availability #356', status: 'success' },
    { id: 5, timestamp: '2024-05-27 12:45', actor: 'Admin System', action: 'schedule_generated', entity: 'Schedule #41', status: 'success' },
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Audit Logs" description="Track all system actions and changes" />
        
        <div className="p-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Entity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.actor}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.action.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.entity}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
