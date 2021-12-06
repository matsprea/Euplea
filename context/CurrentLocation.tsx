import { useState, createContext, useContext } from 'react'

const CurrentLocationContext = createContext<any>([])

export const CurrentLocationProvider = ({ children }): JSX.Element => {
  const [currenteLocation, setCurrenteLocation] = useState()

  const value = [currenteLocation, setCurrenteLocation]

  return (
    <CurrentLocationContext.Provider value={value}>
      {children}
    </CurrentLocationContext.Provider>
  )
}

export const useCurrentLocation = (): any[] => {
  const context = useContext(CurrentLocationContext)
  if (context === undefined) {
    throw new Error(
      'useCurrentLocation must be used within a CurrentLocationProvider'
    )
  }
  return context
}
