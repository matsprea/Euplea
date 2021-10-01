import React, { useEffect } from 'react'
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
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'

import { FaSearchLocation } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'

type FormData = {
  topic: string
  days: number
  owner: string
  desc: string
}

const defaultValues: FormData = {
  topic: '',
  days: 2,
  owner: '',
  desc: '',
}

const onSubmit = (values) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2))
      resolve()
    }, 30)
  })
}

export const SearchDrawer = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { t } = useTranslation()

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({ defaultValues })

  const selectDaysValue = watch('days')
  const handleDaysChange = (days) => setValue('days', days)

  useEffect(() => {
    register('days')
  }, [register])

  return (
    <>
      <Button
        leftIcon={<FaSearchLocation />}
        colorScheme="teal"
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
                  <FormLabel htmlFor="days">
                    {t('Day', { count: selectDaysValue })}
                  </FormLabel>

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

                <FormControl isInvalid={!!errors.owner}>
                  <FormLabel htmlFor="owner">Select Owner</FormLabel>
                  <Select
                    id="owner"
                    {...register('owner', {
                      required: `${t('This is required')}`,
                    })}
                  >
                    <option value="segun">Segun Adebayo</option>
                    <option value="kola">Kola Tioluwani</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.owner && errors.owner.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.desc}>
                  <FormLabel htmlFor="desc">Description</FormLabel>
                  <Textarea id="desc" {...register('desc')} />
                  <FormErrorMessage>
                    {errors.desc && errors.desc.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button type="submit" form="my-form">
              {t('Search')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
