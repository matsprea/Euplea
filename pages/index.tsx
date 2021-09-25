import dynamic from 'next/dynamic'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Flex, Center, Box, Heading } from '@chakra-ui/react'
import { MapSkeleton } from '../components/MapSkeleton'
import { Sidebar } from '../components/Sidebar'

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
  return (
    <QueryClientProvider client={queryClient}>
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

export default MapPage
