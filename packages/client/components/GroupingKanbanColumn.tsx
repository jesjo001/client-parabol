import React from 'react'
import graphql from 'babel-plugin-relay/macro'
import {createFragmentContainer} from 'react-relay'
import {GroupingKanbanColumn_reflectionGroups} from '__generated__/GroupingKanbanColumn_reflectionGroups.graphql'
import {GroupingKanbanColumn_meeting} from '__generated__/GroupingKanbanColumn_meeting.graphql'
import {BezierCurve} from '../types/constEnums'
import styled from '@emotion/styled'
import {PALETTE} from '../styles/paletteV2'
import Icon from './Icon'
import {GroupingKanbanColumn_prompt} from '__generated__/GroupingKanbanColumn_prompt.graphql'
import ReflectionGroup from './ReflectionGroup/ReflectionGroup'
import RaisedButton from './RaisedButton'
import CreateReflectionMutation from '../mutations/CreateReflectionMutation'
import getNextSortOrder from '../utils/getNextSortOrder'
import useMutationProps from '../hooks/useMutationProps'
import useAtmosphere from '../hooks/useAtmosphere'

// TODO share with TaskColumn
const Column = styled('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  position: 'relative',
  transition: `background 300ms ${BezierCurve.DECELERATE}`
})

const ColumnHeader = styled('div')({
  color: PALETTE.TEXT_MAIN,
  display: 'flex',
  lineHeight: '24px'
})

const ColumnBody = styled('div')({
  flex: 1,
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  minHeight: 200,
  padding: 8,
  width: 'fit-content'
})

const Prompt = styled('div')({
  fontSize: 20,
  fontStyle: 'italic',
  fontWeight: 600,
  lineHeight: '24px'
})

const AddReflectionButton = styled(RaisedButton)({
  border: 0,
  height: 24,
  lineHeight: '24px',
  padding: 0,
  width: 24
})

interface Props {
  meeting: GroupingKanbanColumn_meeting
  prompt: GroupingKanbanColumn_prompt
  reflectionGroups: GroupingKanbanColumn_reflectionGroups
}

const GroupingKanbanColumn = (props: Props) => {
  const {meeting, reflectionGroups, prompt} = props
  const {question, id: promptId} = prompt
  const {id: meetingId} = meeting
  const {submitting, onError, error, submitMutation, onCompleted} = useMutationProps()
  const atmosphere = useAtmosphere()
  const onClick = () => {
    if (submitting) return
    const input = {
      content: undefined,
      retroPhaseItemId: promptId,
      sortOrder: getNextSortOrder(reflectionGroups)
    }
    submitMutation()
    CreateReflectionMutation(atmosphere, {input}, {meetingId}, onError, onCompleted)
  }

  return (
    <Column>
      <ColumnHeader>
        <AddReflectionButton aria-label={'Add a reflection'} onClick={onClick} waiting={submitting}>
          <Icon>add</Icon>
        </AddReflectionButton>
        <Prompt>{question}</Prompt>
      </ColumnHeader>
      <ColumnBody>
        {reflectionGroups.map((reflectionGroup) => {
          return <ReflectionGroup key={reflectionGroup.id} meeting={meeting} reflectionGroup={reflectionGroup} />
        })}
      </ColumnBody>
    </Column>
  )
}

export default createFragmentContainer(
  GroupingKanbanColumn,
  {
    meeting: graphql`
      fragment GroupingKanbanColumn_meeting on RetrospectiveMeeting {
        id
        ...ReflectionGroup_meeting
      }`,
    reflectionGroups: graphql`
      fragment GroupingKanbanColumn_reflectionGroups on RetroReflectionGroup @relay(plural: true) {
        ...ReflectionGroup_reflectionGroup
        id
        sortOrder
        reflections {
          id
        }
      }`,
    prompt: graphql`
      fragment GroupingKanbanColumn_prompt on RetroPhaseItem {
        id
        question
        title
      }`
  }
)
