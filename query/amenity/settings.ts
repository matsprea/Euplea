import { Style } from 'types'

export const amenityStyle = (style: Style): string[] => {
  switch (style) {
    case Style.Luxury:
      return ['restaurant']
    case Style.Medium:
      return ['restaurant', 'food_court', 'pub', 'cafe']
    case Style.Budget:
      return ['pub', 'cafe']
    default:
      return []
  }
}
