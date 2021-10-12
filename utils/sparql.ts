import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'

const myEngine = newEngine()

export const mySparQLQuery = async (query, sources) =>
  myEngine
    .query(query, {
      sources,
    })
    .then((result: any) => {
      const r: IQueryResultBindings = result
      return r.bindings()
    })
