import { GetStaticProps } from 'next'
import { useToast } from '@chakra-ui/react'
import { useTranslation, SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Header, MapContainer } from 'components'
import { useRef, useEffect, useState } from 'react'
import { SearchData } from 'types'

const TOAST_ID = 'search-toast'

type IndexPageProps = {
  searchData: SearchData
  culturalSites: any[]
  isLoading: boolean
}

const IndexPage = ({
  searchData,
  culturalSites,
  isLoading,
}: IndexPageProps): JSX.Element => {
  const { t } = useTranslation()
  const toastIdRef = useRef<any>()
  const [isCulturalSites, setIsCulturalSites] = useState<boolean>(false)
  const toast = useToast()

  const { style, days, subject, region } = searchData

  const addToast = (description: string) => {
    toastIdRef.current = toast({
      description,
      position: 'top',
      title: t('Searching for'),
      duration: null,
      id: TOAST_ID,
    })
  }

  useEffect(() => {
    setIsCulturalSites(
      !isLoading && style && days && subject && culturalSites?.length > 0
    )
  }, [isLoading, style, days, subject, JSON.stringify(culturalSites)])

  useEffect(() => {
    if (isLoading && style && days && subject && !toast.isActive(TOAST_ID)) {
      addToast(
        t('Search Toast', {
          ...searchData,
          style: t(style),
          region: region ?? 'Italia',
        })
      )
    }
    if (!isLoading) {
      toast.closeAll()
    }
  }, [isLoading])

  return (
    <>
      <Header title={t('header')} />

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

export default IndexPage
