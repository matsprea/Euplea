import { useState, useEffect } from 'react'
import { Bindings } from '@comunica/types'

export const useFetcher = (
  action: () => Promise<Bindings[]>
): { data: Bindings[]; loading: boolean; error: unknown } => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState<Bindings[]>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const actionResult = await action()
        setData(actionResult)
      } catch (e: unknown) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [action])

  return { data, loading, error }
}
