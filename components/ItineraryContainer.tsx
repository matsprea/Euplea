import { Button, Box, useDisclosure } from '@chakra-ui/react'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ItinerarySteps } from 'components'

export const ItineraryContainer = ({ culturalSites }) => {
  const { t } = useTranslation()
  const ItineraryList = useRef<any>()
  const { isOpen, onToggle } = useDisclosure()

  const showItinerary = () => {
    onToggle()
  }

  useEffect(() => {
    isOpen &&
      setTimeout(function () {
        ItineraryList.current.scrollIntoView(true)
      }, 500)
  }, [isOpen])
  return (
    <>
      <Box p="2">
        <Button p="2" onClick={showItinerary}>
          {isOpen ? t('Hide Itinerary') : t('Show Itinerary')}
        </Button>
      </Box>
      <ItinerarySteps
        ref={ItineraryList}
        culturalSites={culturalSites}
        isOpen={isOpen}
      />
    </>
  )
}
