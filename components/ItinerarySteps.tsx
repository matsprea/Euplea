import {
  Box,
  ListItem,
  UnorderedList,
  Link,
  OrderedList,
  Avatar,
  Collapse,
} from '@chakra-ui/react'
import { ImLink } from 'react-icons/im'
import { forwardRef } from 'react'
import { GiGreekTemple } from 'react-icons/gi'

export const ItinerarySteps = forwardRef<any, any>(
  ({ culturalSites, isOpen }, ref) => {

    return (
      <Collapse in={isOpen} animateOpacity>
        <Box p="2">
          <OrderedList spacing={3} ref={ref}>
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
                      <Avatar
                        bgColor="teal"
                        icon={<GiGreekTemple color="white" fontSize="2rem" />}
                        src={site['?sitePreview']?.value}
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
      </Collapse>
    )
  }
)
