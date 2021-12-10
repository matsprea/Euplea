import { Divider, Link, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { FaGithub, FaRegCopyright } from 'react-icons/fa'
import NextLink from 'next/link'
import { useTranslation } from 'next-i18next'

export const Footer = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Box w="100%" pos="fixed" bottom="0" zIndex="1000"  bgColor="white">
      <Divider />
      <Flex p="2">
        <NextLink passHref href="https://github.com/matsprea/Euplea">
          <Link isExternal={true}>
            <Button
              variant="link"
              leftIcon={<FaGithub />}
              color="black"
              as="span"
            >
              GitHub
            </Button>
          </Link>
        </NextLink>
        <Spacer />
        <Box>
          {/* {t('Made with', { name: 'Matteo' })} */}
          </Box>
        <Spacer />
        <NextLink passHref href="/credits">
          <Link>
            <Button
              variant="link"
              rightIcon={<FaRegCopyright />}
              color="black"
              as="span"
            >
              {t('Credits')}
            </Button>
          </Link>
        </NextLink>
      </Flex>
    </Box>
  )
}
