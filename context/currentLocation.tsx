import { useState, createContext, useContext } from 'react'

const CurrentLocationContext = createContext([])

function CurrentLocationProvider({ children }) {
  const [currenteLocation, setCurrenteLocation] = useState()

  const value = [currenteLocation, setCurrenteLocation]

  return (
    <CurrentLocationContext.Provider value={value}>
      {children}
    </CurrentLocationContext.Provider>
  )
}

function useCurrentLocation() {
  const context = useContext(CurrentLocationContext)
  if (context === undefined) {
    throw new Error(
      'useCurrentLocation must be used within a CurrentLocationProvider'
    )
  }
  return context
}

export { CurrentLocationProvider, useCurrentLocation }
