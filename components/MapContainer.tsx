import dynamic from 'next/dynamic'

import { Box, Progress, VStack } from '@chakra-ui/react'

import { CulturalSitesProvider, CurrentLocationProvider } from 'context'
import { MapSkeleton, ItineraryContainer } from 'components'
import { useEffect, useState } from 'react'
import { SearchData } from 'types'

const MAP_CENTER = '42.504306, 12.572639'
const mapCenter = process.env.MAP_CENTER ?? MAP_CENTER

const MAP_ZOOM = '6'
const mapZoom = Number(process.env.MAP_ZOOM ?? MAP_ZOOM)

const DynamicMap = dynamic(() => import('components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

type MapContainerProps = {
  isCulturalSites: boolean
  isLoading: boolean
  culturalSites: any[]
  searchData: SearchData
}
export const MapContainer = ({
  isCulturalSites,
  isLoading,
  culturalSites,
  searchData,
}: MapContainerProps) => {
  const [height, setHeight] = useState('100vh')

  useEffect(() => {
    setHeight(`${window.innerHeight}px`)

    const onResize = () => {
      setHeight(`${window.innerHeight}px`)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <VStack
      spacing={0}
      align="stretch"
      height={`calc(${height} - 60px)`}
      overflowY="auto"
      pos="absolute"
      top="60px"
      w="100%"
    >
      <Box
        w="100%"
        height={`calc(${height} - ${isCulturalSites ? 160 : 100}px)`}
      >
        <CurrentLocationProvider>
          {isLoading ? (
            <>
              <Progress size="sm" isIndeterminate />
              {/* <MapSkeleton height /> */}
            </>
          ) : (
            <CulturalSitesProvider culturalSites={culturalSites}>
              <DynamicMap
                initLocation={mapCenter}
                zoom={mapZoom}
                searchData={searchData}
              />
            </CulturalSitesProvider>
          )}
        </CurrentLocationProvider>
      </Box>
      {!isLoading && isCulturalSites && (
        <ItineraryContainer
          culturalSites={culturalSites}
          searchData={searchData}
        />
      )}
    </VStack>
  )
}
