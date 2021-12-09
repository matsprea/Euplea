import { AppProps } from 'next/app'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { appWithTranslation } from 'next-i18next'
import 'styles/globals.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css'
import { theme } from 'theme'
import { Footer } from 'components'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5"
          />
        </Head>
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default appWithTranslation(MyApp)
