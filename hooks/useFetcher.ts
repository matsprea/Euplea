import { useState, useEffect } from 'react'

export const useFetcher = <T, K>(
  action: (parms: K) => Promise<T>,
  parms: K
): { data: T; loading: boolean; error: unknown } => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState<T>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const actionResult = await action(parms)
        setData(actionResult)
      } catch (e: unknown) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [parms])

  return { data, loading, error }
}
