import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Spacer,
  useDisclosure,
  Select,
} from '@chakra-ui/react'

import { GiCancel } from 'react-icons/gi'
import { FaSearchLocation, FaSearch } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'

import { SearchData, Style, Region } from 'types'
import { amenityRadiusMax, accomodationRadiusMax } from 'utils'

type SearchDrawerProps = {
  searchData?: SearchData
  isLoading: boolean
}

const buildQueryString = (any): string =>
  Object.entries(any)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

export const SearchDrawer = ({
  searchData,
  isLoading,
}: SearchDrawerProps): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const defaultValues = { ...searchData }

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SearchData>({ defaultValues })

  const selectDaysValue = watch('days')
  const handleDaysChange = (days: number) => setValue('days', days)

  const selectStyleValue = watch('style')
  const handleStyleChange = (style: Style) => setValue('style', style)

  const selectRegionValue = watch('region')
  const handleRegionChange = (ev: any) => setValue('region', ev.target.value)

  const selectAmenityRadiusValue = watch('amenityRadius')
  const handleAmenityRadiusChange = (amenityRadius: number) =>
    setValue('amenityRadius', amenityRadius)

  const selectAccomodationRadiusValue = watch('accomodationRadius')
  const handleAccomodationRadiusChange = (accomodationRadius: number) =>
    setValue('accomodationRadius', accomodationRadius)

  useEffect(() => {
    register('days')
    register('style', {
      required: `${t('This is required')}`,
    })
    register('region')
    register('amenityRadius')
    register('accomodationRadius')
  }, [register])

  const onSubmit = (values: SearchData) => {
    const queryString = buildQueryString({
      ...values,
      region: values.region ?? '',
    })

    router.push(`/?${queryString}`)
    onClose()
  }

  return (
    <>
      <Button
        isLoading={isLoading}
        leftIcon={<FaSearchLocation />}
        onClick={onOpen}
      >
        {t('Search')}
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {t('Create a new itinerary')}
          </DrawerHeader>

          <DrawerBody>
            <form id="my-form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="24px">
                <FormControl isInvalid={!!errors.subject}>
                  <FormLabel htmlFor="subject">{t('Subject')}</FormLabel>
                  <Input
                    id="subject"
                    placeholder={t('Please enter a subject')}
                    {...register('subject', {
                      required: `${t('This is required')}`,
                      minLength: {
                        value: 4,
                        message: `${t('Minimum length should be', {
                          length: 4,
                        })}`,
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.subject && errors.subject.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.days}>
                  <FormLabel htmlFor="days">{t('Days')}</FormLabel>

                  <Slider
                    id="days"
                    defaultValue={2}
                    min={1}
                    max={7}
                    step={1}
                    value={selectDaysValue}
                    onChange={handleDaysChange}
                  >
                    <SliderTrack bg="teal.100">
                      <Box position="relative" right={10} />
                      <SliderFilledTrack bg="teal" />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>
                      <Box>{selectDaysValue}</Box>
                    </SliderThumb>
                  </Slider>
                </FormControl>

                <FormControl isInvalid={!!errors.region}>
                  <FormLabel htmlFor="region">{t('Region')}</FormLabel>

                  <Select
                    id="region"
                    step={1}
                    value={selectRegionValue}
                    onChange={handleRegionChange}
                  >
                    <option value="" selected>
                      {t('Select a region')}
                    </option>
                    {Object.keys(Region).map((key) => (
                      <option key={key} value={Region[key]}>
                        {Region[key]}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isInvalid={!!errors.style}>
                  <FormLabel htmlFor="style">{t('Style')}</FormLabel>

                  <RadioGroup
                    id="style"
                    defaultValue={selectStyleValue}
                    onChange={handleStyleChange}
                  >
                    <Stack>
                      <Radio value={Style.Luxury}>{t('Luxury')}</Radio>
                      <Radio value={Style.Medium}>{t('Medium')}</Radio>
                      <Radio value={Style.Budget}>{t('Budget')}</Radio>
                    </Stack>
                  </RadioGroup>

                  <FormErrorMessage>
                    {errors.style && errors.style.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.amenityRadius}>
                  <FormLabel htmlFor="amenityRadius">
                    {t('amenityRadius')}
                  </FormLabel>

                  <Slider
                    id="amenityRadius"
                    defaultValue={1}
                    min={0.25}
                    max={amenityRadiusMax}
                    step={0.25}
                    value={selectAmenityRadiusValue}
                    onChange={handleAmenityRadiusChange}
                  >
                    <SliderTrack bg="teal.100">
                      <Box position="relative" right={10} />
                      <SliderFilledTrack bg="teal" />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>
                      <Box>{selectAmenityRadiusValue}</Box>
                    </SliderThumb>
                  </Slider>
                </FormControl>

                <FormControl isInvalid={!!errors.accomodationRadius}>
                  <FormLabel htmlFor="accomodationRadius">
                    {t('accomodationRadius')}
                  </FormLabel>

                  <Slider
                    id="accomodationRadius"
                    defaultValue={2.5}
                    min={1}
                    max={accomodationRadiusMax}
                    step={0.5}
                    value={selectAccomodationRadiusValue}
                    onChange={handleAccomodationRadiusChange}
                  >
                    <SliderTrack bg="teal.100">
                      <Box position="relative" right={10} />
                      <SliderFilledTrack bg="teal" />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>
                      <Box>{selectAccomodationRadiusValue}</Box>
                    </SliderThumb>
                  </Slider>
                </FormControl>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button type="submit" form="my-form" mr={3} leftIcon={<FaSearch />}>
              {t('Search')}
            </Button>
            <Spacer />
            <Button variant="outline" onClick={onClose} leftIcon={<GiCancel />}>
              {t('Cancel')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
