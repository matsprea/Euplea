import { Style } from 'types'

export const tourismStyle = (style: Style): string[] => {
  switch (style) {
    case Style.Luxury:
      return []
    case Style.Medium:
      return ['chalet', 'apartment']
    case Style.Budget:
      return [
        'hostel',
        'guest_house',
        'motel',
        'camp_site',
        'alpine_hut',
        'wilderness_hut',
      ]
    default:
      return []
  }
}

export const hostelStyle = (style: Style): string[] => {
  switch (style) {
    case Style.Luxury:
      return ['4', '4S', '4.5', '5', '5S', '6']
    case Style.Medium:
      return ['3', '3S', '3.5']
    case Style.Budget:
      return ['1', '1S', '1.5', '2S', '2.5']
    default:
      return []
  }
}