import styled from '@emotion/styled'
import textOverflow from 'universal/styles/helpers/textOverflow'
import appTheme from 'universal/styles/theme/appTheme'
import ui from 'universal/styles/ui'

const DropdownMenuLabel = styled('div')(({isEmpty}) => ({
  ...textOverflow,
  borderBottom: `1px solid ${appTheme.palette.mid30l}`,
  color: ui.palette.dark,
  fontSize: ui.menuItemFontSize,
  fontWeight: 600,
  lineHeight: ui.menuItemHeight,
  marginBottom: isEmpty ? '-' + ui.menuGutterVertical : ui.menuGutterVertical,
  padding: `0 16px`,
  userSelect: 'none'
}))

export default DropdownMenuLabel
