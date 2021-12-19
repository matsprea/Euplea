export const mergeWaysNodes = (results: any[]) => {
  const nodes = results.filter((item) => item.type === 'node' && 'tags' in item)
  const nodesForWays = results.filter(
    (item) => item.type === 'node' && !('tags' in item)
  )
  const ways = results.filter((item) => item.type === 'way')

  return [
    ...nodes,
    ...ways.map((way) => ({
      ...way,
      ...nodesForWays.find((node) => node.id === way.nodes[0]),
    })),
  ]
}

export const filterOverpassErrors = (results: any[]) =>
  results.filter((item) => 'error' in item)
