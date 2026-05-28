export interface Member {
  id: string
  organization: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  status: 'active' | 'inactive' | 'on_leave' | 'suspended'
  member_skills?: Array<{
    id: string
    skill: { id: string; name: string }
    proficiency_level: number
  }>
  fairness_profile?: {
    fairness_score: number
    burnout_score: number
    workload_score: number
    total_assignments: number
  }
  full_name: string
}

export interface Role {
  id: string
  organization: string
  name: string
  description: string
  required_skill?: string
  required_people_count: number
  priority: number
  is_active: boolean
}

export interface Schedule {
  id: string
  organization: string
  name: string
  date: string
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'locked'
  version: number
  assignment_count: number
}

export interface Assignment {
  id: string
  schedule: string
  role: string
  member: string
  auto_generated: boolean
  manually_modified: boolean
  score?: number
}

export interface DashboardMetrics {
  total_members: number
  active_members: number
  average_fairness: number
  total_assignments_30days: number
  high_burnout_risk: number
  schedules_generated: number
}
