export const accomodationRadiusMax = 10 // kilometers
export const amenityRadiusMax = 5 // kilometers

export const accomodationRadiusSetting = process.env
  .NEXT_PUBLIC_ACCOMODATION_RADIUS
  ? parseInt(process.env.NEXT_PUBLIC_ACCOMODATION_RADIUS)
  : accomodationRadiusMax // kilometers

export const amenityRadiusSetting = process.env.NEXT_PUBLIC_AMENITY_RADIUS
  ? parseInt(process.env.NEXT_PUBLIC_AMENITY_RADIUS)
  : amenityRadiusMax // kilometers

export const useOverpass =
  parseInt(process.env.NEXT_PUBLIC_OVERPASS) === 1 ? true : false

export const withCache = true

export const redisUrl = process.env.REDIS_URL
export const redisToken = process.env.REDIS_TOKEN

export const secret =
  process.env.SECRET ||
  '>ty8sTpg;u}>,!c?Zs.$6xr*~~f[v)&8W;WtydFXs\\5%34*EGaE+}_zqc2+L2up'

export const culturalInstituteOrSitePerDay =
  process.env.CULTURAINSTITUTE_PER_DAY &&
  parseInt(process.env.CULTURAINSTITUTE_PER_DAY) > 0
    ? parseInt(process.env.CULTURAINSTITUTE_PER_DAY)
    : 2

export const accomodationMaxCount =
  process.env.ACCOMODATION_MAX_COUNT &&
  parseInt(process.env.ACCOMODATION_MAX_COUNT) > 0
    ? parseInt(process.env.ACCOMODATION_MAX_COUNT)
    : 10

export const amenityMaxCount =
  process.env.AMENITY_MAX_COUNT && parseInt(process.env.AMENITY_MAX_COUNT) > 0
    ? parseInt(process.env.AMENITY_MAX_COUNT)
    : 10

const MAP_CENTER = '42.504306, 12.572639'
export const mapCenter = process.env.MAP_CENTER ?? MAP_CENTER

const MAP_ZOOM = '6'
export const mapZoom = Number(process.env.MAP_ZOOM ?? MAP_ZOOM)
