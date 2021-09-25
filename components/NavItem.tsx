import { ReactText } from 'react'
import {
  Flex,
  Text,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  FlexProps,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import NavHoverBox from '../components/NavHoverBox'

interface NavItemProps extends FlexProps {
  icon: IconType
  description: ReactText
  active: boolean
  navSize: any
  href?: string
}

export default function NavItem({
  icon,
  title,
  description,
  active,
  navSize,
  href,
}: NavItemProps): JSX.Element {
  return (
    <Flex
      mt={30}
      flexDir="column"
      w="100%"
      alignItems={navSize == 'small' ? 'center' : 'flex-start'}
    >
      <Menu placement="right">
        <Link
          // backgroundColor={active && '#AEC8CA'}
          color={'teal.600'}
          p={3}
          borderRadius={8}
          _hover={{
            textDecor: 'none',
            backgroundColor: 'teal.600',
            color: 'white',
          }}
          w={navSize == 'large' && '100%'}
          href={href}
        >
          <MenuButton w="100%" variant={active ? 'outline' : 'solid'}>
            <Flex>
              <Icon as={icon} fontSize="xl" />
              <Text ml={5} display={navSize == 'small' ? 'none' : 'flex'}>
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
        <MenuList py={0} border="none" w={200} h={200} ml={5}>
          <NavHoverBox title={title} icon={icon} description={description} />
        </MenuList>
      </Menu>
    </Flex>
  )
}
