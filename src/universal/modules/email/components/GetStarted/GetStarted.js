import React from 'react'
import appTheme from 'universal/styles/theme/appTheme'
import ui from 'universal/styles/ui'
import EmptySpace from '../EmptySpace/EmptySpace'

const GetStarted = () => {
  const linkStyle = {
    color: appTheme.palette.warm,
    fontWeight: 600
  }

  const headingStyle = {
    color: ui.colorText,
    fontWeight: 600,
    textTransform: 'uppercase'
  }

  const cellStyle = {
    padding: 0,
    textAlign: 'center'
  }

  return (
    <table style={ui.emailTableBase}>
      <tbody>
        <tr>
          <td style={cellStyle}>
            <EmptySpace height={8} />
            <span style={headingStyle}>Getting Started</span>
            <br />
            {'Read '}
            <a
              href='https://focus.parabol.co/how-to-navigate-uncertainty-fc0dfaaf3830'
              rel='noopener noreferrer'
              style={linkStyle}
              target='_blank'
              title='How to Navigate Uncertainty using the Action Rhythm'
            >
              {'How to Navigate Uncertainty'}
            </a>
            {' so you'}
            <br />
            {'can get into the swing of things.'}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default GetStarted
