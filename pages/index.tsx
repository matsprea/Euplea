import dynamic from 'next/dynamic'
import { GetStaticProps } from 'next'
import { Flex, Center, Box, Heading, Spacer } from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { SearchData, Style } from '../types'

import { Header } from 'components/Header'
import { MapSkeleton } from 'components/MapSkeleton'
import { SearchDrawer } from 'components/SearchDrawer'

const DynamicMap = dynamic(() => import('components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

const defaultInitLocation = { lat: 45.464664, lng: 9.18854 }
const searchData: SearchData = { topic: '', days: 2, style: Style.Medium }

const MapPage = (): JSX.Element => {
  const { t } = useTranslation()

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
          <DynamicMap
            initLocation={defaultInitLocation}
            searchData={searchData}
          />
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
