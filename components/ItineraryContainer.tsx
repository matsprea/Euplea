import { Button, Box } from '@chakra-ui/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ItinerarySteps } from 'components'

export const ItineraryContainer = ({ culturalSites }) => {
  const { t } = useTranslation()
  const ItineraryList = useRef<any>()

  const showItinerary = () => {
    ItineraryList.current.scrollIntoView({ behavior: 'smooth' })
  }
  const showMap = () => {
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Box p="2">
        <Button onClick={showItinerary}>{t('Show Itinerary')}</Button>
      </Box>
      <ItinerarySteps ref={ItineraryList} culturalSites={culturalSites} />
      <Box p="2">
        <Button onClick={showMap}>{t('Show Map')}</Button>
      </Box>
    </>
  )
}
