import { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { appWithTranslation } from 'next-i18next'
import 'styles/globals.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css'
import { theme } from 'theme'
import { BasePage } from 'components'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5"
        />
      </Head>
      <BasePage Component={Component} pageProps={pageProps}   />
    </ChakraProvider>
  </QueryClientProvider>
)

export default appWithTranslation(MyApp)
