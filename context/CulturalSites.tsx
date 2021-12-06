import { useState, createContext, useContext } from 'react'
import { useCulturalSiteAPI } from 'hooks'

const CulturalSitesContext = createContext([])

export const CulturalSiteProvider = ({ children }) => {
  const [culturalSites, setCulturalSites] = useState()

  const value = [culturalSites, setCulturalSites]

  return (
    <CulturalSitesContext.Provider value={value}>
      {children}
    </CulturalSitesContext.Provider>
  )
}

export const useCulturalSite = () => {
  const context = useContext(CulturalSitesContext)
  if (context === undefined) {
    throw new Error(
      'useCurrentLocation must be used within a CulturalSitesProvider'
    )
  }
  return context
}
