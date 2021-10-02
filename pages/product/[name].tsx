import { useRouter } from 'next/router'

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

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}