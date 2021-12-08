import {
  Button,
  Box,
  ListIcon,
  ListItem,
  UnorderedList,
  Link,
  OrderedList,
  Image,
} from '@chakra-ui/react'
import { ImLink } from 'react-icons/im'

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { GiGreekTemple } from 'react-icons/gi'

export const ItineraryList = ({ culturalSites }) => {
  const { t } = useTranslation()
  const ItineraryList = useRef<any>()

  const onClick = () => {
    ItineraryList.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Button onClick={onClick}>{t('Show Itinerary')}</Button>

      <Box p="40px" rounded="md" shadow="md">
        <OrderedList spacing={3} ref={ItineraryList}>
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
              <UnorderedList>
                {culturalSite['site'].map((site, index) => (
                  <ListItem key={index}>
                    <ListIcon as={GiGreekTemple} />
                    {site['?siteLabel'].value}
                    {site['?sitePreview']?.value && (
                      <Image
                        src={site['?sitePreview'].value}
                        alt={site['?siteLabel'].value}
                        boxSize="100px"
                      />
                    )}
                    {site['?siteFullAddress']?.value}
                    {site['?siteCityName']?.value}
                  </ListItem>
                ))}
              </UnorderedList>
            </ListItem>
          ))}
        </OrderedList>
      </Box>
    </>
  )
}
