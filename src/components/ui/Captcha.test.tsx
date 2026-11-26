import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Captcha } from './Captcha'

describe('Captcha', () => {
  it('renders nothing while captcha is off', () => {
    const { container } = render(
      <Captcha containerRef={createRef()} isEnabled={false} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('gives the widget a container through the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Captcha containerRef={ref} isEnabled />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('tells the user when the challenge could not load', () => {
    render(<Captcha containerRef={createRef()} isEnabled hasLoadError />)
    expect(screen.getByRole('alert')).toHaveTextContent(/verificação anti-robô/)
  })
})
