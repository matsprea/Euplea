import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import {
  Flex,
  Center,
  Box,
  Heading,
  Spacer,
  Progress,
  useToast,
} from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { SearchData, Style } from 'types'

import { useCulturalSiteAPI } from 'hooks'
import { CulturalSitesProvider } from 'context'
import { Header } from 'components/Header'
import { MapSkeleton } from 'components/MapSkeleton'
import { SearchDrawer } from 'components/SearchDrawer'
import { useRef, useEffect } from 'react'

const DynamicMap = dynamic(() => import('components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

const MAP_CENTER = '42.504306, 12.572639'
const mapCenter = process.env.MAP_CENTER ?? MAP_CENTER

const MAP_ZOOM = '6'
const mapZoom = Number(process.env.MAP_ZOOM ?? MAP_ZOOM)

const MapPage = (): JSX.Element => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const toastIdRef = useRef<any>()
  const toast = useToast()

  const addToast = (description: string) => {
    toastIdRef.current = toast({
      description,
      position: 'top',
      title: t('Searching for'),
      duration: null,
    })
  }

  const style = query?.style as Style
  const days = Number(query?.days ?? 2)
  const topic = query?.topic as string

  const searchData: SearchData = {
    style,
    days,
    topic,
  }

  const { data: culturalSites, status } = useCulturalSiteAPI(
    style && days && topic && searchData
  )
  const isLoading = status === 'loading'

  useEffect(() => {
    if (isLoading && !toastIdRef.current) {
      addToast(t('Search Toast', searchData))
    } else {
      toast.closeAll()
    }
  }, [isLoading])

  return (
    <>
      <Header title={t('header')} />

      <Flex className="App " w="100%" direction="column">
        <Flex>
          <Box p="2">
            <Heading as="h1">Euplea</Heading>
          </Box>
          <Spacer />
          <Center p="2">
            <SearchDrawer searchData={searchData} addToast={addToast} />
          </Center>
        </Flex>
        <Box w="100%">
          {isLoading ? (
            <Progress size="sm" isIndeterminate />
          ) : (
            <CulturalSitesProvider culturalSites={culturalSites}>
              <DynamicMap initLocation={mapCenter} zoom={mapZoom} />
            </CulturalSitesProvider>
          )}
        </Box>
      </Flex>
    </>
  )
}

export const getStaticProps: GetStaticProps<SSRConfig> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default MapPage
