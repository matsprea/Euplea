import { useState, useEffect } from 'react'

export const useFetcher = <T>(
  action: () => Promise<T>
): { data: T; loading: boolean; error: unknown } => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState<T>(null)

  console.log('data ', data)

  console.log('error ', error)

  console.log('loading ', loading)

  useEffect(() => {
    async function loadData () {
      try {
        setLoading(true)
        const actionResult = await action()
        setData(actionResult)
        setLoading(false)
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
