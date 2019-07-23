import styled from '@emotion/styled'
import {modalShadow} from 'universal/styles/elevation'
import {Radius} from 'universal/types/constEnums'

const DialogContainer = styled('div')({
  display: 'flex',
  backgroundColor: 'white',
  borderRadius: Radius.DIALOG,
  boxShadow: modalShadow,
  flexDirection: 'column',
  // overflow: 'auto', removed because react-beautiful-dnd can only handle 1 scroll component
  margin: '0 auto',
  maxHeight: '90vh',
  maxWidth: 'calc(100vw - 48px)',
  minWidth: 280,
  width: 560
})

export default DialogContainer
