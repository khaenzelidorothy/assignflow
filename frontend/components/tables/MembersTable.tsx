'use client'

import { Table, THead, TBody, Th, Td, Tr } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Member {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  status: 'active' | 'inactive' | 'on_leave'
  skills_count?: number
}

interface MembersTableProps {
  members: Member[]
  onEdit?: (member: Member) => void
  onDelete?: (member: Member) => void
  isLoading?: boolean
}

const statusVariant: Record<string, 'success' | 'error' | 'warning'> = {
  active: 'success',
  inactive: 'error',
  on_leave: 'warning',
}

export function MembersTable({ members, onEdit, onDelete, isLoading }: MembersTableProps) {
  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading members...</div>
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <span className="text-4xl block mb-2">👥</span>
        <p className="text-gray-500">No members found</p>
        <p className="text-sm text-gray-400 mt-1">Add your first member to get started</p>
      </div>
    )
  }

  return (
    <Table>
      <THead>
        <Tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Status</Th>
          <Th>Skills</Th>
          <Th>Actions</Th>
        </Tr>
      </THead>
      <TBody>
        {members.map((member) => (
          <Tr key={member.id}>
            <Td className="font-medium">
              {member.first_name} {member.last_name}
            </Td>
            <Td className="text-gray-500">{member.email}</Td>
            <Td className="text-gray-500">{member.phone_number || '—'}</Td>
            <Td>
              <Badge variant={statusVariant[member.status]}>
                {member.status.replace('_', ' ')}
              </Badge>
            </Td>
            <Td>
              <span className="text-sm text-gray-500">
                {member.skills_count || 0} skills
              </span>
            </Td>
            <Td>
              <div className="flex gap-2">
                {onEdit && (
                  <Button size="sm" variant="ghost" onClick={() => onEdit(member)}>
                    ✏️
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="ghost" onClick={() => onDelete(member)}>
                    🗑️
                  </Button>
                )}
              </div>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}
