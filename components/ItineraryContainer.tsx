import {
  Button,
  Box,
  useDisclosure,
  Spacer,
  HStack,
  Heading,
  useMediaQuery,
  IconButton,
} from '@chakra-ui/react'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
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
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const { region } = searchData

  const itineraryTitle = t('Itinerary title', {
    ...searchData,
    style: t(searchData.style),
    region: region ? region as string : 'Italia',
  })

  const showItinerary = () => {
    onToggle()
  }

  const shareItinerary = async () =>
    navigator.share
      ? await navigator.share({
          url: window.location.href,
          title: itineraryTitle,
          text: itineraryTitle,
        })
      : Promise.resolve()

  useEffect(() => {
    isOpen &&
      setTimeout(function () {
        ItineraryList.current.scrollIntoView(true)
      }, 500)
  }, [isOpen])

  return (
    <Box style={{ marginBottom: '42px' }}>
      <HStack p="2">
        <Box>
          {!isMobile ? (
            <Button
              p="2"
              onClick={showItinerary}
              leftIcon={isOpen ? <FaCaretUp /> : <FaCaretDown />}
            >
              {isOpen ? t('Hide itinerary') : t('Show itinerary')}
            </Button>
          ) : (
            <IconButton
              onClick={showItinerary}
              aria-label={isOpen ? t('Hide itinerary') : t('Show itinerary')}
              icon={isOpen ? <FaCaretUp /> : <FaCaretDown />}
            />
          )}
        </Box>
        <Spacer />
        <Box>
          <Heading as="h2" color="teal" size="md">
            {itineraryTitle}
          </Heading>
        </Box>
        <Spacer />
        <Box>
          {!isMobile ? (
            <Button p="2" onClick={shareItinerary} leftIcon={<FaShareAlt />}>
              {t('Share')}
            </Button>
          ) : (
            <IconButton
              onClick={shareItinerary}
              aria-label={t('Share')}
              icon={<FaShareAlt />}
            />
          )}
        </Box>
      </HStack>
      <ItinerarySteps
        ref={ItineraryList}
        culturalSites={culturalSites}
        isOpen={isOpen}
      />
    </Box>
  )
}
