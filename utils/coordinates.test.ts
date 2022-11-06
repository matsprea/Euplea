import {
  siteCoordinates,
  coordinatesToLongLat,
  coordinatesToLatLong,
  siteCoordinatesToLongLat,
  coordinatesFromLongLat,
  fistSitesofCulturalSites,
  sitesofCulturalSites,
  culturalSitesCoordinates,
  coordinatesLongLatFromArray,
  siteToPointOfInterest,
  osmToPointOfInterest,
  overpassToPointOfInterest,
  getMinMax,
  getPointOfInterestMinMax,
  getLatLongMinMax,
} from './coordinates'

test.each([
  [[], []],
  [
    [{ '?long': { value: '1' }, '?lat': { value: '2' } }],
    [{ long: 1, lat: 2 }],
  ],
])('siteCoordinates', (sites, expected) => {
  expect(siteCoordinates(sites)).toEqual(expected)
})

test.each([
  [[], []],
  [[{ '?long': { value: '1' }, '?lat': { value: '2' } }], [[1, 2]]],
  [
    [
      { '?long': { value: '1' }, '?lat': { value: '2' } },
      { '?long': { value: '3' }, '?lat': { value: '4' } },
    ],
    [
      [1, 2],
      [3, 4],
    ],
  ],
])('siteCoordinatesToLongLat', (sites, expected) => {
  expect(siteCoordinatesToLongLat(sites)).toEqual(expected)
})

test.each([[{ long: 1, lat: 2 }, [1, 2]]])(
  'coordinatesToLongLat',
  (value, expected) => {
    expect(coordinatesToLongLat(value)).toEqual(expected)
  }
)

test.each([[{ long: 1, lat: 2 }, [2, 1]]])(
  'coordinatesToLatLong',
  (value, expected) => {
    expect(coordinatesToLatLong(value)).toEqual(expected)
  }
)

test.each([[[2, 1] as [any, any], { long: 2, lat: 1 }]])(
  'coordinatesFromLongLat',
  (value, expected) => {
    expect(coordinatesFromLongLat(value)).toEqual(expected)
  }
)

test.each([
  [[], []],
  [[{ site: [1] }], [1]],
  [
    [{ site: [1, 2] }, { site: [3, 4] }],
    [1, 3],
  ],
])('fistSitesofCulturalSites', (sites, expected) => {
  expect(fistSitesofCulturalSites(sites)).toEqual(expected)
})

test.each([
  [[], []],
  [[{ site: [1, 2] }], [1, 2]],
  [
    [{ site: [1, 2] }, { site: [3, 4] }],
    [1, 2, 3, 4],
  ],
])('sitesofCulturalSites', (sites, expected) => {
  expect(sitesofCulturalSites(sites)).toEqual(expected)
})

test.each([
  [[], []],
  [
    [
      {
        site: [
          { '?long': { value: '1' }, '?lat': { value: '2' } },
          { '?long': { value: '2' }, '?lat': { value: '3' } },
        ],
      },
    ],
    [{ lat: 2, long: 1 }],
  ],
])('culturalSitesCoordinates', (sites, expected) => {
  expect(culturalSitesCoordinates(sites)).toEqual(expected)
})

test.each([
  [[], []],
  [
    ['1', '2', '3', '4', '5', '6'],
    [
      ['1', '2'],
      ['3', '4'],
      ['5', '6'],
    ],
  ],
  [
    ['1', '2', '3'],
    [['1', '2'], ['3']],
  ],
])('coordinatesLongLatFromArray', (value, expected) => {
  expect(coordinatesLongLatFromArray(value)).toEqual(expected)
})

test.each([
  [
    {
      '?long': { value: '1' },
      '?lat': { value: '2' },
      '?siteLabel': { value: 'label' },
    },
    {
      lat: 2,
      long: 1,
      label: 'label',
      otherInfo: { address: undefined, city: undefined },
    },
  ],
  [
    {
      '?long': { value: '3' },
      '?lat': { value: '4' },
      '?siteLabel': { value: 'site label' },
      '?siteFullAddress': { value: 'full address' },
      '?siteCityName': { value: 'city name' },
    },
    {
      lat: 4,
      long: 3,
      label: 'site label',
      otherInfo: { address: 'full address', city: 'city name' },
    },
  ],
])('siteToPointOfInterest', (value, expected) => {
  expect(siteToPointOfInterest(value)).toEqual(expected)
})

test.each([
  [
    undefined,
    {
      '?coordinates': { value: 'point(1.0 2.0)' },
      '?name': { value: 'name' },
    },
    {
      lat: 2,
      long: 1,
      label: 'name',
      otherInfo: undefined,
    },
  ],
  [
    () => 'test',
    {
      '?coordinates': { value: 'point(1.0 2.0)' },
      '?name': { value: 'name' },
    },
    {
      lat: 2,
      long: 1,
      label: 'name',
      otherInfo: 'test',
    },
  ],
])('osmToPointOfInterest', (otherinfo, value, expected) => {
  expect(osmToPointOfInterest(otherinfo)(value)).toEqual(expected)
})

test.each([
  [
    undefined,
    {
      lat: '2',
      lon: '1',
      tags: {
        name: 'name',
      },
    },
    {
      lat: 2,
      long: 1,
      label: 'name',
      otherInfo: undefined,
    },
  ],
  [
    () => 'test',
    {
      lat: '2',
      lon: '1',
      tags: {
        name: 'name',
      },
    },
    {
      lat: 2,
      long: 1,
      label: 'name',
      otherInfo: 'test',
    },
  ],
])('overpassToPointOfInterest', (otherinfo, value, expected) => {
  expect(overpassToPointOfInterest(otherinfo)(value)).toEqual(expected)
})

test.each([
  [
    [],
    [],
    [
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ],
  ],
  [
    [2, 1, 3],
    [5, 3, 8],
    [
      [3, 8],
      [1, 3],
    ],
  ],
])('getMinMax', (latValues, longValues, expected) => {
  expect(getMinMax(latValues, longValues)).toEqual(expected)
})

test.each([
  [
    [],
    [
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ],
  ],
  [
    [
      {
        lat: 5,
        long: 1,
        label: 'name a',
      },
      {
        lat: 3,
        long: 2,
        label: 'name b',
      },
    ],
    [
      [5, 2],
      [3, 1],
    ],
  ],
])('getPointOfInterestMinMax', (values, expected) => {
  expect(getPointOfInterestMinMax(values)).toEqual(expected)
})

test.each([
  [
    [
      [5, 1],
      [3, 2],
    ],
    [
      [5, 2],
      [3, 1],
    ],
  ],
])('getLatLongMinMax', (values, expected) => {
  expect(getLatLongMinMax(values)).toEqual(expected)
})
