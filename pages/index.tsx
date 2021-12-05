import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { Flex, Center, Box, Heading, Spacer, Progress } from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { SearchData, Style } from 'types'

import { useCulturalSites } from 'hooks/useCulturalSites'
import { Header } from 'components/Header'
import { MapSkeleton } from 'components/MapSkeleton'
import { SearchDrawer } from 'components/SearchDrawer'

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

  const searchData: SearchData = {
    style: (query?.style as Style) ?? Style.Medium,
    days: Number(query?.days ?? 2),
    topic: (query?.topic as string) ?? 'notte',
  }

  const { data: culturalSites, status } = useCulturalSites(searchData)
  const isLoading = status === 'loading'

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
            <SearchDrawer searchData={searchData} />
          </Center>
        </Flex>
        <Box w="100%">
          {isLoading ? (
            <Progress size="sm" isIndeterminate />
          ) : (
            <DynamicMap
              initLocation={mapCenter}
              zoom={mapZoom}
              culturalSites={culturalSites}
            />
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
