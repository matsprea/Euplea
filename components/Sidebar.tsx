import React, { useState } from 'react'
import { Flex, IconButton, Button, Spacer, Box, Center } from '@chakra-ui/react'
import {
  FiMenu,
  FiMap,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiBriefcase,
  FiSettings,
} from 'react-icons/fi'
import { IoPawOutline } from 'react-icons/io5'
import NavItem from '../components/NavItem'

export const Sidebar = (): JSX.Element => {
  const [navSize, changeNavSize] = useState('large')
  return (
    <Flex
      pos="sticky"
      left="0"
      h="100vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize == 'small' ? '15px' : '30px'}
      w={navSize == 'small' ? '75px' : '200px'}
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex
        p="5%"
        pt="10px"
        flexDir="column"
        w="100%"
        alignItems={navSize == 'small' ? 'center' : 'flex-start'}
        as="nav"
      >
        <IconButton
          aria-label="menu"
          // background="none"
          variant="outline"
          mt={5}
          // _hover={{ background: 'none' }}
          icon={<FiMenu />}
          onClick={() => {
            if (navSize == 'small') changeNavSize('large')
            else changeNavSize('small')
          }}
        />
        <NavItem
          navSize={navSize}
          icon={FiMap}
          title="Mappa"
          description="This is the description for the dashboard."
          active={false}
          href="/map"
        />
        <NavItem
          navSize={navSize}
          icon={FiCalendar}
          title="Calendar"
          description="Calendar"
          active
        />
        <NavItem
          navSize={navSize}
          icon={FiUser}
          title="Clients"
          description="Calendar"
          active={false}
        />
        <NavItem
          navSize={navSize}
          icon={IoPawOutline}
          title="Animals"
          description="Calendar"
          active={false}
        />
        <NavItem
          navSize={navSize}
          icon={FiDollarSign}
          title="Stocks"
          description="Calendar"
          active={false}
        />
        <NavItem
          navSize={navSize}
          icon={FiBriefcase}
          title="Reports"
          description="Calendar"
          active={false}
        />
        <NavItem
          navSize={navSize}
          icon={FiSettings}
          title="Settings"
          description="Calendar"
          active={false}
        />
      </Flex>
      <Spacer />
      <Box>
        <Center>
          <Button m="4" hidden={navSize == 'small'}>
            Cerca
          </Button>
        </Center>
      </Box>
    </Flex>
  )
}
