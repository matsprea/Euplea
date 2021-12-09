import {
  Box,
  ListItem,
  UnorderedList,
  Link,
  OrderedList,
  Avatar,
  Collapse,
  // Button,
} from '@chakra-ui/react'
import { ImLink } from 'react-icons/im'

import { forwardRef } from 'react'
// import { useTranslation } from 'react-i18next'
import { GiGreekTemple } from 'react-icons/gi'
// import { BiArrowFromBottom } from 'react-icons/bi'

// const showMap = () => {
//   window.scrollTo(0, 0)
// }

export const ItinerarySteps = forwardRef<any, any>(
  ({ culturalSites, isOpen }, ref) => {
    // const { t } = useTranslation()
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
        {/* <Box p="2" pos="fixed" bottom="10" right={5}>
          <Button leftIcon={<BiArrowFromBottom />} onClick={showMap}>
            {t('Top')}
          </Button>
        </Box> */}
      </Collapse>
    )
  }
)
