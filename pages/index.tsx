import dynamic from 'next/dynamic'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Flex, Center, Box, Heading } from '@chakra-ui/react'
import { MapSkeleton } from '../components/MapSkeleton'
import { Sidebar } from '../components/Sidebar'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Header } from '../components/Header'

const DynamicMap = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const defaultInitLocation = { lat: 45.464664, lng: 9.18854 }

const MapPage = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default MapPage
