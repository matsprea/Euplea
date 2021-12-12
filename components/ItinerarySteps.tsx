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
import { useTranslation } from 'next-i18next'
import { forwardRef } from 'react'
import { GiGreekTemple } from 'react-icons/gi'

export const ItinerarySteps = forwardRef<any, any>(
  ({ culturalSites, isOpen }, ref) => {
    const {t } = useTranslation()
    
    return (
      <Collapse in={isOpen} animateOpacity>
        <Box p="2" marginBottom="42px">
          <VStack spacing={3} ref={ref}>
            {culturalSites.map((culturalSite, _index) => (
              <Box
                key={culturalSite['?culturalInstituteOrSite'].value}
                w="100%"
                shadow="md"
                padding={2}
              >
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
                    <TagLabel>
                      {t('Cultural items', culturalSite['?count'].value)}
                    </TagLabel>
                  </Tag>
                </HStack>
                <Box>
                  <VStack>
                    {culturalSite['site'].map((site, _index) => (
                      <Flex
                        Box
                        key={site['?site']?.value}
                        w="100%"
                        padding={2}
                      >
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
