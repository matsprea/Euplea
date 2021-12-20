import { Box, Center, Heading, Link, VStack } from '@chakra-ui/react'
import { Header } from 'components'
import { GetStaticProps } from 'next'
import { SSRConfig, useTranslation, Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'

const CreditsPage = (): JSX.Element => {
  const { t } = useTranslation()
  const [height, setHeight] = useState('100vh')

  useEffect(() => {
    setHeight(`${window.innerHeight}px`)

    const onResize = () => {
      setHeight(`${window.innerHeight}px`)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <Header title={`${t('header')} - ${t('Credits')}`} />
      <VStack
        padding={2}
        spacing={0}
        align="stretch"
        height={`calc(${height} - 60px)`}
        overflowY="auto"
        pos="absolute"
        top="60px"
        w="100%"
      >
        <Center>
          <Heading as="h2" size="lg" color="teal">
            {t('Credits')}
          </Heading>
        </Center>
        <Box m={2} boxShadow="md" p="6" rounded="md">
          <Heading as="h3" size="md" color="teal" m={2}>
            {t('Licence')}
          </Heading>
          <p>
            <Trans i18nKey="LicenceKey">
              This webapp is licenced under the{' '}
              <Link
                href="https://github.com/matsprea/Euplea/blob/main/LICENSE"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                Apache License 2.0
              </Link>{' '}
              and the source code is available on this{' '}
              <Link
                href="https://github.com/matsprea/Euplea"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                repository
              </Link>
              .
            </Trans>
          </p>
        </Box>
        <Box m={2} boxShadow="md" p="6" rounded="md">
          <Heading as="h3" size="md" color="teal" m={2}>
            {t('Data sources')}
          </Heading>
          <p>
            <Trans i18nKey="DataSources1">
              This webapp allows you to search on the{' '}
              <Link
                href="https://dati.beniculturali.it/"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                cultural heritage database
              </Link>{' '}
              of{' '}
              <Link
                href="https://www.beniculturali.it/"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                the Ministry of Culture
              </Link>{' '}
              made available as{' '}
              <Link
                href="https://wikipedia.org/wiki/Linked_data"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                Linked Open Data
              </Link>
              .
            </Trans>
          </p>
          <p>
            <Trans i18nKey="DataSources2">
              The accomodations and amenities data are retrieved from{' '}
              <Link
                href="https://openstreetmap.org/"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                OpenStreetMap
              </Link>{' '}
              using{' '}
              <Link
                href="https://github.com/Sophox/sophox"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                Sophox
              </Link>{' '}
              and{' '}
              <Link
                href="https://overpass-turbo.eu/"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                Overpass Turbo
              </Link>
              .
            </Trans>
          </p>
          <p>
            <Trans i18nKey="DataSources3">
              The data are displayed on the map using{' '}
              <Link
                href="https://leafletjs.com/"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                leaflet
              </Link>{' '}
              and the underlying map is provided by{' '}
              <Link
                href="https://openstreetmap.org/"
                isExternal
                textDecoration="underline"
                color="teal"
              >
                OpenStreetMap
              </Link>
              .
            </Trans>
          </p>
        </Box>
      </VStack>
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

export default CreditsPage
