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
