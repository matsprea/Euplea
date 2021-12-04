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
} from '@chakra-ui/react'

import { GiCancel } from 'react-icons/gi'
import { FaSearchLocation, FaSearch } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'

import { SearchData, Style } from '../../types';

type SearchDrawerProps = {
  searchData?: SearchData
} 

const buildQueryString = (any): string =>
  Object.entries(any)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

export const SearchDrawer = ({ searchData }: SearchDrawerProps): JSX.Element => {
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

  useEffect(() => {
    register('days')
    register('style', {
      required: `${t('This is required')}`,
    })
  }, [register])

  const onSubmit = (values: SearchData) => {
    router.push(`/?${buildQueryString(values)}`)
    onClose()
  }

  return (
    <>
      <Button leftIcon={<FaSearchLocation />} onClick={onOpen}>
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
                <FormControl isInvalid={!!errors.topic}>
                  <FormLabel htmlFor="topic">{t('Topic')}</FormLabel>
                  <Input
                    id="topic"
                    placeholder={t('Please enter a topic')}
                    {...register('topic', {
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
                    {errors.topic && errors.topic.message}
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
