import { Header } from 'components'
import { GetStaticProps } from 'next'
import { SSRConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const CreditsPage = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <>
      <Header title={`${t('header')} - ${t('Credits')}`} />
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
