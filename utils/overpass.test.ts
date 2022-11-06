import { filterOverpassErrors, mergeWaysNodes } from './overpass'

test.each([
  [[], []],
  [[{ type: 'node' }], []],
  [
    [{ type: 'node', tags: [{ key: 'foo', value: 'bar' }] }],
    [{ type: 'node', tags: [{ key: 'foo', value: 'bar' }] }],
  ],
  [
    [
      { type: 'node', id: 1, other: 'foo' },
      { type: 'way', nodes: [1], tags: [{ key: 'foo', value: 'bar' }] },
    ],
    [
      {
        type: 'node',
        id: 1,
        other: 'foo',
        nodes: [1],
        tags: [{ key: 'foo', value: 'bar' }],
      },
    ],
  ],
])('mergeWaysNodes', (values: any[], expected: any[]) => {
  expect(mergeWaysNodes(values)).toEqual(expected)
})


test.each([
  [[], []],
  [[{ error: 'error' }], []],
  [[{ error: 'error' }, { error: 'error' }], []],
  [
    [{ error: 'error' }, { notError: 'something' }],
    [{ notError: 'something' }],
  ],
  [[{ notError: 'something' }], [{ notError: 'something' }]],
])('filterOverpassErrors', (values: any[], expected: any[]) => {
  expect(filterOverpassErrors(values)).toEqual(expected)
})
