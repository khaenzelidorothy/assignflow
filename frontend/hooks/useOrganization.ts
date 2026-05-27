'use client'

import { useState, useEffect } from 'react'

interface Organization {
  id: string
  name: string
  subscription_plan: string
  timezone: string
}

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch organization from API or local storage
    const storedOrg = localStorage.getItem('organization')
    if (storedOrg) {
      setOrganization(JSON.parse(storedOrg))
    }
    setIsLoading(false)
  }, [])

  return { organization, isLoading }
}
