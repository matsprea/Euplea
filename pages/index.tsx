import dynamic from 'next/dynamic'
import { GetStaticProps } from 'next'
import { Flex, Center, Box, Heading } from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Header } from 'components/Header'
import { MapSkeleton } from 'components/MapSkeleton'
import { Sidebar } from 'components/Sidebar'

const DynamicMap = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

const defaultInitLocation = { lat: 45.464664, lng: 9.18854 }

const MapPage = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <>
      <Header title={t('header')} />

      <Flex>
        <Sidebar />
        <Flex className="App " w="100%" direction="column">
          <Flex h="100px" w="100%">
            <Center h="100px" w="100%">
              <Heading as="h1">Euplea</Heading>
              {/* <Cassetto /> */}
            </Center>
          </Flex>

          <Box w="100%">
            <DynamicMap initLocation={defaultInitLocation} />
          </Box>
        </Flex>
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
