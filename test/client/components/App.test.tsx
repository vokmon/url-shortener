import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TestComponent from '~/app/_components/TestComponent'


describe('App', () => {
  it('renders the App component', () => {
    render(<TestComponent title="Test component" />)
    
    screen.debug(); // prints out the jsx in the App component unto the command line
    expect(
      screen.getByRole("heading", { level: 1, name: "Test component" }),
    ).toBeDefined();
  })
})