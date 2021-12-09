import {
  Divider,
  Link,
  Flex,
  Spacer,
  Box,
  Button,
} from '@chakra-ui/react'
import { FaGithub, FaRegCopyright } from 'react-icons/fa'
import NextLink from 'next/link'

export const Footer = (): JSX.Element => {
  return (
    <Box w='100%'  >
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
        <Box>Made with ❤️</Box>
        <Spacer />
        <NextLink passHref href="/credits">
          <Link>
            <Button
              variant="link"
              rightIcon={<FaRegCopyright />}
              color="black"
              as="span"
            >
              Credits
            </Button>
          </Link>
        </NextLink>
      </Flex>
    </Box>
  )
}
