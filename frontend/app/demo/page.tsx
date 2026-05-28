'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0)

  const demoSteps = [
    {
      title: 'Dashboard Overview',
      description: 'Get a comprehensive view of your team scheduling at a glance',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Key Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600 mt-1">Total Members</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">92%</div>
                <div className="text-sm text-gray-600 mt-1">Fairness Score</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600 mt-1">Shifts Scheduled</div>
              </div>
            </div>
          </div>
          <p className="text-gray-600">See your scheduling metrics, upcoming assignments, and fairness indicators in real-time.</p>
        </div>
      )
    },
    {
      title: 'Member Management',
      description: 'Add and manage team members with their skills and availability',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Example: Adding a Team Member</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3">
                <p className="font-medium">Name: Sarah Johnson</p>
                <p className="text-sm text-gray-600">Email: sarah@example.com</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="font-medium">Skills: Teaching, Mentoring, Admin</p>
                <p className="text-sm text-gray-600">Availability: Mon-Fri, 9 AM - 5 PM</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600">Track individual member profiles, their expertise, constraints, and work preferences.</p>
        </div>
      )
    },
    {
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling that respects fairness and constraints',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Scheduling Algorithm Considers:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Fair distribution of work</li>
              <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Individual availability windows</li>
              <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Required skills for each role</li>
              <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Previous assignment history</li>
              <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Rest period requirements</li>
            </ul>
          </div>
          <p className="text-gray-600">Our intelligent system creates schedules that are fair, efficient, and consider all constraints.</p>
        </div>
      )
    },
    {
      title: 'Availability Management',
      description: 'Set and track team member availability windows',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Weekly Availability Calendar</h3>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day}>
                  <p className="font-medium text-gray-700 mb-2">{day}</p>
                  <div className={`${idx < 5 ? 'bg-green-200' : 'bg-gray-200'} rounded p-1 h-8`}></div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-600">Members can specify their available time slots, and the system respects these constraints.</p>
        </div>
      )
    },
    {
      title: 'Analytics & Reports',
      description: 'Track fairness metrics and scheduling efficiency',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Key Analytics:</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Fairness Distribution</p>
                <div className="bg-gray-200 rounded h-2 mt-1">
                  <div className="bg-yellow-500 h-2 rounded" style={{width: '92%'}}></div>
                </div>
              </div>
              <div>
                <p className="font-medium">Scheduling Utilization</p>
                <div className="bg-gray-200 rounded h-2 mt-1">
                  <div className="bg-blue-500 h-2 rounded" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <p className="font-medium">Constraint Satisfaction</p>
                <div className="bg-gray-200 rounded h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded" style={{width: '98%'}}></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600">Monitor performance metrics to optimize your scheduling process over time.</p>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">AssignFlow Demo</h1>
          <p className="text-gray-600 mt-2">Interactive walkthrough of our intelligent scheduling platform</p>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Demo Steps</h3>
              <div className="space-y-2">
                {demoSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                      activeStep === idx
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${
                        activeStep === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      {step.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {demoSteps[activeStep].title}
              </h2>
              <p className="text-gray-600 mb-6">{demoSteps[activeStep].description}</p>
              
              {/* Content */}
              <div className="mb-8">
                {demoSteps[activeStep].content}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    activeStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {demoSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        idx === activeStep ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    ></button>
                  ))}
                </div>

                {activeStep === demoSteps.length - 1 ? (
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Link>
                ) : (
                  <button
                    onClick={() => setActiveStep(Math.min(demoSteps.length - 1, activeStep + 1))}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
