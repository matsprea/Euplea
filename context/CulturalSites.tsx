import { useState, createContext, useContext } from 'react'

const CulturalSitesContext = createContext([])

function CulturalSitesProvider({ children }) {
  const [culturalSites, setCulturalSites] = useState()

  const value = [culturalSites, setCulturalSites]

  return (
    <CulturalSitesContext.Provider value={value}>
      {children}
    </CulturalSitesContext.Provider>
  )
}

function useCulturalSites() {
  const context = useContext(CulturalSitesContext)
  if (context === undefined) {
    throw new Error(
      'useCurrentLocation must be used within a CulturalSitesProvider'
    )
  }
  return context
}

export { CulturalSitesProvider, useCulturalSites }
