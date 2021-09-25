import { useState, useEffect } from 'react'

export const useFetcher = (action: () => any): any => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState<unknown>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const actionData = await action()
        setData(actionData)
      } catch (e: any) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [action])

  return { data, loading, error }
}
