import React from 'react'
import styled from '@emotion/styled'
import MiniPokerCardPlaceholder from './MiniPokerCardPlaceholder'
import PokerVotingAvatarGroup from './PokerVotingAvatarGroup'
import PokerVotingRowBase from './PokerVotingRowBase'
import PokerVotingRowEmpty from './PokerVotingRowEmpty'
import Icon from './Icon'
import TipBanner from './TipBanner'
import SecondaryButtonCool from './SecondaryButtonCool'
import {PALETTE} from '~/styles/paletteV2'
import getDemoAvatar from '~/utils/getDemoAvatar'

const CheckIcon = styled(Icon)({
  color: PALETTE.TEXT_GREEN
})

const BannerWrap = styled('div')({
  margin: 'auto',
  padding: '8px 0 200px' // accounts for deck of cards below the tip
})

const StyledTipBanner = styled(TipBanner)({
  margin: 'auto'
})

const RevealButtonBlock = styled('div')({
  padding: '8px 16px'
})

const PokerActiveVoting = () => {
  const hasVotes = true
  const isFacilitator = true
  const viewerHasVoted = false

  // Show the facilitator a tooltip if nobody has voted yet
  // Show the participant a tooltip if they haven’t voted yet
  // Consider dismissing the tooltip silently if each role has seen their tooltip once
  // - Show the facilitator a tooltip if nobody has voted yet and the facilitator hasn’t revealed once
  // - Show the participant a tooltip if they haven’t voted once
  const showTip = Boolean(isFacilitator && !hasVotes || !isFacilitator && !viewerHasVoted)
  const tipCopy = isFacilitator
    ? 'Votes are automatically revealed once everyone has voted.'
    : 'Tap a card to vote. Swipe to view each dimension.'

  const voters = [
    getDemoAvatar(1),
    getDemoAvatar(2),
    getDemoAvatar(3),
    getDemoAvatar(4),
    getDemoAvatar(5),
    getDemoAvatar(6),
    getDemoAvatar(7),
    getDemoAvatar(8),
    getDemoAvatar(9),
    getDemoAvatar(10),
    getDemoAvatar(11),
    getDemoAvatar(12),
    getDemoAvatar(13)
  ]

  return (
    <>
      {hasVotes
        ? <>
          <PokerVotingRowBase>
            <MiniPokerCardPlaceholder>
              <CheckIcon>check</CheckIcon>
            </MiniPokerCardPlaceholder>
            <PokerVotingAvatarGroup voters={voters} />
          </PokerVotingRowBase>
          {/* Show the reveal button if 2+ people have voted */}
          {voters.length > 1
            ? <RevealButtonBlock>
              <SecondaryButtonCool>{'Reveal Votes'}</SecondaryButtonCool>
            </RevealButtonBlock>
            : null
          }
        </>
        : <PokerVotingRowEmpty />
      }
      {showTip ? <BannerWrap><StyledTipBanner>{tipCopy}</StyledTipBanner></BannerWrap> : null}
    </>
  )
}

export default PokerActiveVoting
