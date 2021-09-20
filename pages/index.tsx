import Sidebar from '../components/Sidebar'
import { Flex, Text, IconButton } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'

const Home = (): JSX.Element => {
  return (
    <Flex w="100%">
      <Sidebar />
      <Flex
        pos="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Text>
          Click the
          <IconButton
            aria-label="Menu"
            background="none"
            _hover={{ background: 'none' }}
            icon={<FiMenu />}
          />
          to resize the vertical navigation bar.
        </Text>
      </Flex>
    </Flex>
  )
}

export default Home
