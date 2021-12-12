import {
  Button,
  Box,
  useDisclosure,
  Spacer,
  HStack,
  Heading,
} from '@chakra-ui/react'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ItinerarySteps } from 'components'
import { SearchData } from 'types'
import { FaCaretDown, FaCaretUp, FaShareAlt } from 'react-icons/fa'


type ItineraryContainerProps = {
  culturalSites: any[]
  searchData: SearchData
}

export const ItineraryContainer = ({
  culturalSites,
  searchData,
}: ItineraryContainerProps) => {
  const { t } = useTranslation()
  const ItineraryList = useRef<any>()
  const { isOpen, onToggle } = useDisclosure()

  const itineraryTitle = t('Itinerary title', {
    ...searchData,
    style: t(searchData.style),
    region: searchData.region ?? 'Italia',
  })

  const showItinerary = () => {
    onToggle()
  }

  const shareItinerary = async () => {
    await navigator.share({
      url: window.location.href,
      title: itineraryTitle,
      text: 'TBD',
    })
  }

  useEffect(() => {
    isOpen &&
      setTimeout(function () {
        ItineraryList.current.scrollIntoView(true)
      }, 500)
  }, [isOpen])

  const canShare = navigator.canShare && navigator.canShare()

  return (
    <>
      <HStack p="2">
        <Button
          p="2"
          onClick={showItinerary}
          leftIcon={isOpen ? <FaCaretUp /> : <FaCaretDown />}
        >
          {isOpen ? t('Hide itinerary') : t('Show itinerary')}
        </Button>
        <Spacer />
        <Box>
          <Heading as="h2" color="teal" size="md">
            {itineraryTitle}
          </Heading>
        </Box>
        <Spacer />
        {canShare && (
          <Button p="2" onClick={shareItinerary} leftIcon={<FaShareAlt />}>
            {t('Share')}
          </Button>
        )}
      </HStack>
      <ItinerarySteps
        ref={ItineraryList}
        culturalSites={culturalSites}
        isOpen={isOpen}
      />
    </>
  )
}
