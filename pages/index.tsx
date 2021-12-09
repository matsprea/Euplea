import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import NextLink from 'next/link'
import {
  Flex,
  Center,
  Box,
  Heading,
  Spacer,
  Progress,
  useToast,
  VStack,
  Link,
} from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { SearchData, Style } from 'types'
import { useCulturalSiteAPI } from 'hooks'
import { CulturalSitesProvider, CurrentLocationProvider } from 'context'
import {
  Header,
  MapSkeleton,
  SearchDrawer,
  ItineraryContainer,
} from 'components'
import { useRef, useEffect } from 'react'

const DynamicMap = dynamic(() => import('components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

const MAP_CENTER = '42.504306, 12.572639'
const mapCenter = process.env.MAP_CENTER ?? MAP_CENTER

const MAP_ZOOM = '6'
const mapZoom = Number(process.env.MAP_ZOOM ?? MAP_ZOOM)

const TOAST_ID = 'search-toast'

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
      id: TOAST_ID,
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
  const isCulturalSites = culturalSites?.length > 0

  useEffect(() => {
    if (isLoading && style && days && topic && !toast.isActive(TOAST_ID)) {
      addToast(t('Search Toast', { ...searchData, style: t(style) }))
    }
    if (!isLoading) {
      toast.closeAll()
    }
  }, [isLoading])

  return (
    <>
      <Header title={t('header')} />

      <VStack
        spacing={0}
        align="stretch"
        height={`calc(100vh - 42px)`}
        overflowY="auto"
      >
        <Flex p="2">
          <Box>
            <NextLink href="/" passHref>
              <Link color="teal">
                <Heading as="h1">Euplea</Heading>
              </Link>
            </NextLink>
          </Box>
          <Spacer />
          <Center>
            <SearchDrawer searchData={searchData} isLoading={isLoading} />
          </Center>
        </Flex>
        <Box w="100%">
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
                  height={`calc(100vh - ${isCulturalSites ? 162 : 102}px)`}
                />
              </CulturalSitesProvider>
            )}
          </CurrentLocationProvider>
        </Box>
        {!isLoading && isCulturalSites && (
          <ItineraryContainer culturalSites={culturalSites} />
        )}
      </VStack>
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
