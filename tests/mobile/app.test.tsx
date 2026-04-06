import { render, screen } from '@testing-library/react-native'
import App from '../../mobile/App'

describe('App', () => {
  it('renders onboarding copy', () => {
    render(<App />)
    expect(
      screen.getByText('Open up App.tsx to start working on your app!')
    ).toBeTruthy()
  })
})
