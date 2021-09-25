import React from 'react'
import { render, act } from '../testUtils'
import Home from '../../pages/index'

describe('Home page', () => {
  it('matches snapshot', async () => {
    await act(async () => {
      const { asFragment } = await render(<Home />, {})

      expect(asFragment()).toMatchSnapshot()
    })
  })

  // it('clicking button triggers alert', () => {
  //   const { getByText } = render(<Home />, {})
  //   window.alert = jest.fn()
  //   fireEvent.click(getByText('Test Button'))
  //   expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
  // })
})
