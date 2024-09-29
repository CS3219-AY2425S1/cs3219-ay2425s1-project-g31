import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import Layout from '../components/layout/layout'
import { NavBar } from '@/components/layout/navbar'

describe('Layout', () => {
    it('renders the logo', () => {
        render(<NavBar />)

        const logo = screen.getByRole('img')
        expect(logo).toBeInTheDocument()
    })
})
