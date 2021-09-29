import Head from 'next/head'

interface HeaderProps {
  title: string
}

export const Header = ({ title }: HeaderProps): JSX.Element => {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}
