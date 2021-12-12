import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import NextLink from 'next/link'
import {
  Flex,
  Center,
  Box,
  Heading,
  Spacer,
  useToast,
  Link,
} from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Region, SearchData, Style } from 'types'
import { useCulturalSiteAPI } from 'hooks'
import { Header, SearchDrawer, MapContainer } from 'components'
import { useRef, useEffect, useState } from 'react'

const TOAST_ID = 'search-toast'

const MapPage = (): JSX.Element => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const toastIdRef = useRef<any>()
  const [isCulturalSites, setIsCulturalSites] = useState<boolean>(false)

  const toast = useToast()

  const addToast = (description: string) => {
    toastIdRef.current = toast({
      description,
      position: 'top',
      title: t('Searching for'),
      duration: null,
      id: TOAST_ID,
    })
  }

  const style = query?.style as Style
  const days = Number(query?.days ?? 2)
  const subject = query?.subject as string
  const region = query?.region as Region
  
  const searchData: SearchData = {
    style,
    days,
    subject,
    region
  }

  const { data: culturalSites, status } = useCulturalSiteAPI(
    style && days && subject && searchData
  )

  const isLoading = status === 'loading'

  useEffect(() => {
    setIsCulturalSites(
      status !== 'loading' &&
        style &&
        days &&
        subject &&
        culturalSites?.length > 0
    )
  }, [status, style, days, subject, JSON.stringify(culturalSites)])

  useEffect(() => {
    if (isLoading && style && days && subject && !toast.isActive(TOAST_ID)) {
      addToast(t('Search Toast', { ...searchData, style: t(style), region: region ?? 'Italia' }))
    }
    if (!isLoading) {
      toast.closeAll()
    }
  }, [isLoading])

  return (
    <>
      <Header title={t('header')} />

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
      <MapContainer
        isCulturalSites={isCulturalSites}
        isLoading={isLoading}
        culturalSites={culturalSites}
      />
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
