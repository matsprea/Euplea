import dynamic from 'next/dynamic'
// import Sidebar from '../components/Sidebar'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Flex, Center, Box, Heading } from '@chakra-ui/react'
import { MapSkeleton } from '../components/MapSkeleton'

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
      <Flex className="App " w="100%" direction="column">
        <Flex h="100px" w="100%">
          <Center h="100px" w="100%">
            <Heading color="teal" as="h1">
              Euplea
            </Heading>
            {/* <Cassetto /> */}
          </Center>
        </Flex>

        <Box w="100%">
          <DynamicMap initLocation={defaultInitLocation} />
        </Box>
      </Flex>
      {/* </Flex> */}
    </QueryClientProvider>
  )
}

export default MapPage
