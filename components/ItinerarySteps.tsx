import {
  Box,
  ListItem,
  UnorderedList,
  Link,
  OrderedList,
  Avatar,
} from '@chakra-ui/react'
import { ImLink } from 'react-icons/im'

import { forwardRef } from 'react'
// import { useTranslation } from 'react-i18next'
import { GiGreekTemple } from 'react-icons/gi'

export const ItinerarySteps = forwardRef<any, any>(({ culturalSites }, ref) => {
  return (
    <Box p="2" ref={ref}>
      <OrderedList spacing={3}>
        {culturalSites.map((culturalSite, index) => (
          <ListItem key={index}>
            <Link
              href={culturalSite['?culturalInstituteOrSite'].value}
              isExternal
            >
              {culturalSite['?culturalInstituteOrSite'].value}
              <ImLink />
              Count {culturalSite['?count'].value}
            </Link>
            <UnorderedList spacing={3}>
              {culturalSite['site'].map((site, index) => (
                <ListItem key={index}>
                  {/* <ListIcon as={GiGreekTemple} /> */}
                  <Avatar
                    bgColor="teal"
                    icon={<GiGreekTemple color="white" fontSize="2rem" />}
                    src={site['?sitePreview']?.value}
                    // name={site['?siteLabel'].value}
                  />
                  {site['?siteLabel'].value}
                  {site['?siteFullAddress']?.value}
                  {site['?siteCityName']?.value}
                </ListItem>
              ))}
            </UnorderedList>
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  )
})
