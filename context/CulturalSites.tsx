import { createContext, useContext } from 'react'

const CulturalSitesContext = createContext<any>({})

export const CulturalSitesProvider = ({ culturalSites, children }) => {
  return (
    <CulturalSitesContext.Provider value={{ culturalSites }}>
      {children}
    </CulturalSitesContext.Provider>
  )
}

export const useCulturalSites = () => {
  const context = useContext(CulturalSitesContext)
  if (context === undefined) {
    throw new Error(
      'useCulturalSites must be used within a CulturalSitesProvider'
    )
  }

  return context
}
