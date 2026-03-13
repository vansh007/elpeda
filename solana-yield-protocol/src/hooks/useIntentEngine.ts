import { useState, useCallback } from 'react'
import type { IntentResponse } from '@/types'
import { parseIntent } from '@/lib/claudeClient'

export function useIntentEngine() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<IntentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submitIntent = useCallback(async (input: string, depositAmount = 1000) => {
    if (!input.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await parseIntent(input, depositAmount)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze intent. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearIntent = useCallback(() => {
    setResponse(null)
    setError(null)
  }, [])

  return {
    loading,
    response,
    error,
    submitIntent,
    clearIntent,
  }
}
