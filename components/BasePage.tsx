import { Box, Center, Flex, Heading, Link, Spacer } from '@chakra-ui/react'
import { useCulturalSiteAPI } from 'hooks'
import { useRouter } from 'next/router'
import { Region, SearchData, Style } from 'types'
import { Footer } from './Footer'
import { SearchDrawer } from './SearchDrawer'
import NextLink from 'next/link'
import { accomodationRadiusSetting, amenityRadiusSetting } from 'utils'

export const BasePage = ({ Component, ...pageProps }): JSX.Element => {
  const { query } = useRouter()

  const style = query?.style as Style
  const days = Number(query?.days ?? 2) > 10 ? 10 : Number(query?.days ?? 2)
  const subject = query?.subject as string
  const region = query?.region as Region
  const accomodationRadius = Number(
    query?.accomodationRadius ?? accomodationRadiusSetting
  )
  const amenityRadius = Number(query?.amenityRadius ?? amenityRadiusSetting)

  const searchData: SearchData = {
    style,
    days,
    subject,
    region,
    accomodationRadius,
    amenityRadius,
  }

  const { data: culturalSites, status } = useCulturalSiteAPI(
    style && days && subject && searchData
  )

  const isLoading = status === 'loading'

  return (
    <>
      <Flex p="2" pos="fixed" top="0" w="100%">
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
      <Component
        {...pageProps}
        isLoading={isLoading}
        culturalSites={culturalSites}
        searchData={searchData}
      />
      <Footer />
    </>
  )
}
