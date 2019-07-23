import React from 'react'
import styled from '@emotion/styled'
import RaisedButton from 'universal/components/RaisedButton'
import GoogleSVG from 'universal/components/GoogleSVG'

interface Props {
  label: string
  onClick: () => void
  waiting?: boolean
}

interface StyleProps {
  waiting: boolean | undefined
}

const StyledButton = styled(RaisedButton)<StyleProps>(({waiting}) => ({
  backgroundColor: waiting ? '#ebebeb' : 'white',
  borderRadius: 20,
  color: waiting ? '#8D8D8D' : '#757575',
  height: 40,
  margin: '0 auto',
  padding: '0 16px',
  width: 240,
  ':disabled': {
    opacity: 1
  }
}))

const IconBlock = styled('div')<StyleProps>(({waiting}) => ({
  marginRight: 16,
  '& svg': {
    display: 'block',
    height: 18,
    width: 18,
    '& path': {
      fill: waiting ? '#8D8D8D' : undefined
    }
  }
}))

const Label = styled('div')({
  fontSize: 14
})

function GoogleOAuthButton (props: Props) {
  const {onClick, label, waiting} = props
  return (
    <StyledButton onClick={onClick} waiting={waiting}>
      <IconBlock waiting={waiting}>
        <GoogleSVG />
      </IconBlock>
      <Label>{label}</Label>
    </StyledButton>
  )
}

export default GoogleOAuthButton
