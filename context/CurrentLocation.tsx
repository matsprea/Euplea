import { useState, createContext, useContext, useEffect } from 'react'

const CurrentLocationContext = createContext<GeolocationCoordinates>(null)

export const CurrentLocationProvider = ({ children }): JSX.Element => {
  const [currenteLocation, setCurrenteLocation] =
    useState<GeolocationCoordinates>()

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser')
    } else {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setCurrenteLocation(coords)
      })
    }
  })
  return (
    <CurrentLocationContext.Provider value={currenteLocation}>
      {children}
    </CurrentLocationContext.Provider>
  )
}

export const useCurrentLocation = (): GeolocationCoordinates => {
  const context = useContext(CurrentLocationContext)
  // if (context === undefined) {
  //   throw new Error(
  //     'useCurrentLocation must be used within a CurrentLocationProvider'
  //   )
  // }
  return context
}
