import { useCallback } from 'react'
import { Bindings } from '@comunica/types'
import {
  newEngine,
  IQueryResultBindings,
  IQueryResult,
} from '@comunica/actor-init-sparql'
import { SearchData, useSparQLParms, useSparQLResult } from '../types'
import { useFetcher } from './useFetcher'

const myEngine = newEngine()

export const getMyQuery =
  ({ sources, query }: useSparQLParms) =>
  (searchData: SearchData): Promise<IQueryResult> => {
    if (typeof query === 'function') {
      return myEngine.query(query(searchData), { sources })
    } else {
      return myEngine.query(query, { sources })
    }
  }

const getMyQueryData =
  (myQueryResult: Promise<IQueryResult>): (() => Promise<Bindings[]>) =>
  () =>
    myQueryResult.then((result: any) => {
      const r: IQueryResultBindings = result
      return r.bindings()
    })

let useSparQLCount = 0

export const useSparQL =
  ( myQuery: Promise<IQueryResult>): useSparQLResult => {

      const getMyQuery = useCallback(() => {
        return getMyQueryData(myQuery)
      }, [myQuery])

 
    
    console.info('useSparQL Count ', useSparQLCount++)

    return useFetcher<Bindings[]>(getMyQuery( ))
  }

 