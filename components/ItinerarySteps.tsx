import {
  Box,
  Link,
  Avatar,
  Collapse,
  Heading,
  VStack,
  Spacer,
  HStack,
  Flex,
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import { forwardRef } from 'react'
import { GiGreekTemple } from 'react-icons/gi'

export const ItinerarySteps = forwardRef<any, any>(
  ({ culturalSites, isOpen }, ref) => {
    return (
      <Collapse in={isOpen} animateOpacity>
        <Box p="2" marginBottom="42px">
          {/* <Heading as="h2">Cultural institution</Heading> */}
          <VStack spacing={3} ref={ref}>
            {culturalSites.map((culturalSite, index) => (
              <Box key={index} w="100%" shadow="md" padding={2}>
                <HStack>
                  <Link
                    href={culturalSite['?culturalInstituteOrSite'].value}
                    isExternal
                  >
                    <Heading as="h2" size="lg">
                      {culturalSite['?culturalInstituteOrSiteLabel'].value}
                    </Heading>
                  </Link>
                  <Spacer />
                  <Tag size="lg" borderRadius="full" minWidth="100px">
                    <TagLabel>{culturalSite['?count'].value} items</TagLabel>
                  </Tag>
                </HStack>
                <Box>
                  <VStack>
                    {/* <Heading as="h4">Sites:</Heading> */}
                    {/* <UnorderedList spacing={3}>*/}
                    {culturalSite['site'].map((site, index) => (
                      <Flex Box key={index} w="100%" padding={2}>
                        <Avatar
                          bgColor="teal"
                          icon={<GiGreekTemple color="white" fontSize="2rem" />}
                          src={site['?sitePreview']?.value}
                          marginRight={2}
                        />
                        <Box>
                          <Heading as="h3" size="md">
                            {site['?siteLabel'].value}
                          </Heading>
                          {site['?siteFullAddress']?.value},{' '}
                          {site['?siteCityName']?.value}
                        </Box>
                        <Spacer />
                      </Flex>
                    ))}
                    {/*</UnorderedList> */}
                  </VStack>
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>
      </Collapse>
    )
  }
)
