'use client'

import { createClient } from '@repo/supabase/client'
import { useState, useEffect } from 'react'

type Platform = {
  id: string
  platform_name: string
  display_name: string
  connected: boolean
  is_active: boolean
}

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlatforms = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data: platformsData } = await supabase
        .from('platform_registry')
        .select('*')
        .eq('is_active', true)
      const { data: connectionsData } = await supabase
        .from('platform_connections')
        .select('*, platform_registry(*)')
        .eq('user_id', user?.id)

      const connections = connectionsData?.reduce((acc, conn) => {
        acc[conn.platform_id] = conn
        return acc
      }, {})

      const platformsWithConnections = platformsData?.map((platform) => {
        const connection = connections[platform.id]

        return {
          ...platform,
          connected: !!connection,
          is_active: connection?.is_active || false,
        }
      }) as Platform[]

      console.log(
        'Fetched platforms:',
        platformsData,
        connections,
        platformsWithConnections
      )

      setPlatforms(platformsWithConnections)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlatforms()
  }, [])

  return {
    platforms,
    loading,
    error,
    refetch: fetchPlatforms,
  }
}
