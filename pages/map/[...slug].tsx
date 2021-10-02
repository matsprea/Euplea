import { GetStaticProps, GetStaticPaths } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Flex, Center, Box, Heading, Spacer } from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Header } from 'components/Header'
import { MapSkeleton } from 'components/MapSkeleton'
import { SearchDrawer } from 'components/SearchDrawer'

import { Style } from '../../types'

const DynamicMap = dynamic(() => import('components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

const defaultInitLocation = { lat: 45.464664, lng: 9.18854 }

const MapPage = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const { slug } = router.query
  const [ style, days, topic] = slug as string[]

  const searchData = {
    style: style as Style,
    days: Number(days),
    topic,
  }
  
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default MapPage
