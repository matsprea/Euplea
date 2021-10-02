import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Product = () => {
  const router = useRouter()
  const { name } = router.query

  return (
    // `name` is defined after hydrating client-side
    name && (
      <div>
        <h1>{name}</h1>
        <p>Welcome to our product page for {name}!</p>
      </div>
    )
  )
}

export default Product

export const getStaticProps: GetStaticProps<SSRConfig> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
