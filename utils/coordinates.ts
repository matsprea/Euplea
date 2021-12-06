export const siteCoordinates = (sites) => [
  ...sites.map((site) => [
    Number(site['?long'].value),
    Number(site['?lat'].value),
  ]),
]
