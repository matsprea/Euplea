import { Bindings } from '@comunica/types'

export type useSparQLParms = {
  query: string | ((...arg0: any) => string)
  sources: { type: string; value: string }[]
}

export type useSparQLResult = {
  data: Bindings[]
  loading: boolean
  error: unknown
}
