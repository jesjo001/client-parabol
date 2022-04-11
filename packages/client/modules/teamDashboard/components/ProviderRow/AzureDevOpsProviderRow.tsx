import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import AzureDevOpsSVG from '~/components/AzureDevOpsSVG'
import AzureDevOpsConfigMenu from '../../../../components/AzureDevOpsConfigMenu'
import AzureDevOpsProviderLogo from '../../../../components/AzureDevOpsProviderLogo'
import FlatButton from '../../../../components/FlatButton'
import Icon from '../../../../components/Icon'
import ProviderActions from '../../../../components/ProviderActions'
import ProviderCard from '../../../../components/ProviderCard'
import RowInfo from '../../../../components/Row/RowInfo'
import RowInfoCopy from '../../../../components/Row/RowInfoCopy'
import withAtmosphere, {
  WithAtmosphereProps
} from '../../../../decorators/withAtmosphere/withAtmosphere'
import useBreakpoint from '../../../../hooks/useBreakpoint'
import {MenuPosition} from '../../../../hooks/useCoords'
import useMenu from '../../../../hooks/useMenu'
import {MenuMutationProps} from '../../../../hooks/useMutationProps'
import {PALETTE} from '../../../../styles/paletteV3'
import {ICON_SIZE} from '../../../../styles/typographyV2'
import {Breakpoint, Providers} from '../../../../types/constEnums'
import AzureDevOpsClientManager from '../../../../utils/AzureDevOpsClientManager'
import withMutationProps, {WithMutationProps} from '../../../../utils/relay/withMutationProps'
import {AzureDevOpsProviderRow_viewer} from '../../../../__generated__/AzureDevOpsProviderRow_viewer.graphql'

const StyledButton = styled(FlatButton)({
  borderColor: PALETTE.SLATE_400,
  color: PALETTE.SLATE_700,
  fontSize: 14,
  fontWeight: 600,
  minWidth: 36,
  paddingLeft: 0,
  paddingRight: 0,
  width: '100%'
})

// eslint-disable-next-line @typescript-eslint/ban-types
interface Props extends WithAtmosphereProps, WithMutationProps, RouteComponentProps<{}> {
  teamId: string
  viewer: AzureDevOpsProviderRow_viewer
}

const MenuButton = styled(FlatButton)({
  color: PALETTE.GRAPE_700,
  fontSize: ICON_SIZE.MD18,
  height: 24,
  userSelect: 'none',
  marginLeft: 4,
  padding: 0,
  width: 24
})

const StyledIcon = styled(Icon)({
  fontSize: ICON_SIZE.MD18
})

const ListAndMenu = styled('div')({
  display: 'flex',
  position: 'absolute',
  right: 16,
  top: 16
})

const AzureDevOpsLogin = styled('div')({})

const ProviderName = styled('div')({
  color: PALETTE.SLATE_700,
  fontSize: 16,
  fontWeight: 600,
  lineHeight: '24px',
  alignItems: 'center',
  display: 'flex',
  marginRight: 16,
  verticalAlign: 'middle'
})

const AzureDevOpsProviderRow = (props: Props) => {
  const {atmosphere, viewer, teamId, submitting, submitMutation, onError, onCompleted} = props
  const mutationProps = {submitting, submitMutation, onError, onCompleted} as MenuMutationProps
  const {teamMember} = viewer
  const {integrations} = teamMember!
  const {azureDevOps} = integrations
  const provider = azureDevOps?.sharedProviders[0]
  const accessToken = azureDevOps?.accessToken ?? undefined

  if (!provider) return null

  const openOAuth = async () => {
    await AzureDevOpsClientManager.openOAuth(atmosphere, teamId, provider.id, mutationProps)
  }

  const {togglePortal, originRef, menuPortal, menuProps} = useMenu(MenuPosition.UPPER_RIGHT)
  const isDesktop = useBreakpoint(Breakpoint.SIDEBAR_LEFT)
  return (
    <ProviderCard>
      <AzureDevOpsProviderLogo />
      <RowInfo>
        <ProviderName>{Providers.AZUREDEVOPS_NAME}</ProviderName>
        <RowInfoCopy>{Providers.AZUREDEVOPS_DESC}</RowInfoCopy>
      </RowInfo>
      {!accessToken && (
        <ProviderActions>
          <StyledButton key='linkAccount' onClick={openOAuth} palette='warm' waiting={submitting}>
            {isDesktop ? 'Connect' : <Icon>add</Icon>}
          </StyledButton>
        </ProviderActions>
      )}
      {accessToken && (
        <ListAndMenu>
          <AzureDevOpsLogin title={azureDevOps!.id}>
            <AzureDevOpsSVG />
          </AzureDevOpsLogin>
          <MenuButton onClick={togglePortal} ref={originRef}>
            <StyledIcon>more_vert</StyledIcon>
          </MenuButton>
          {menuPortal(
            <AzureDevOpsConfigMenu
              menuProps={menuProps}
              mutationProps={mutationProps}
              teamId={teamId}
              providerId={provider.id}
            />
          )}
        </ListAndMenu>
      )}
    </ProviderCard>
  )
}

graphql`
  fragment AzureDevOpsProviderRowAzureDevOpsIntegration on AzureDevOpsIntegration {
    accessToken
    id
    sharedProviders {
      id
    }
  }
`

export default createFragmentContainer(
  withAtmosphere(withMutationProps(withRouter(AzureDevOpsProviderRow))),
  {
    viewer: graphql`
      fragment AzureDevOpsProviderRow_viewer on User {
        teamMember(teamId: $teamId) {
          integrations {
            azureDevOps {
              ...AzureDevOpsProviderRowAzureDevOpsIntegration @relay(mask: false)
            }
          }
        }
      }
    `
  }
)