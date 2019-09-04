import {GraphQLID, GraphQLNonNull, GraphQLString} from 'graphql'
import getRethink from '../../database/rethinkDriver'
import {getUserId, isTeamMember} from '../../utils/authorization'
import UpdateReflectionContentPayload from '../types/UpdateReflectionContentPayload'
import normalizeRawDraftJS from '../../../client/validation/normalizeRawDraftJS'
import publish from '../../utils/publish'
import isPhaseComplete from '../../../client/utils/meetings/isPhaseComplete'
import standardError from '../../utils/standardError'
import {SubscriptionChannel} from 'parabol-client/types/constEnums'
import {NewMeetingPhaseTypeEnum} from 'parabol-client/types/graphql'
import Reflection from '../../database/types/Reflection'
import extractTextFromDraftString from 'parabol-client/utils/draftjs/extractTextFromDraftString'
import getReflectionEntities from './helpers/getReflectionEntities'

export default {
  type: UpdateReflectionContentPayload,
  description: 'Update the content of a reflection',
  args: {
    reflectionId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'A stringified draft-js document containing thoughts'
    }
  },
  async resolve(_source, {reflectionId, content}, {authToken, dataLoader, socketId: mutatorId}) {
    const r = getRethink()
    const operationId = dataLoader.share()
    const now = new Date()
    const subOptions = {operationId, mutatorId}

    // AUTH
    const viewerId = getUserId(authToken)
    const reflection = await r.table('RetroReflection').get(reflectionId) as Reflection | null
    if (!reflection) {
      return standardError(new Error('Reflection not found'), {userId: viewerId})
    }
    const {creatorId, meetingId} = reflection
    const meeting = await dataLoader.get('newMeetings').load(meetingId)
    const {endedAt, phases, teamId} = meeting
    if (!isTeamMember(authToken, teamId)) {
      return standardError(new Error('Team not found'), {userId: viewerId})
    }
    if (endedAt) return standardError(new Error('Meeting already ended'), {userId: viewerId})
    if (isPhaseComplete(NewMeetingPhaseTypeEnum.group, phases)) {
      return standardError(new Error('Meeting phase already ended'), {userId: viewerId})
    }
    if (creatorId !== viewerId) {
      return standardError(new Error('Reflection not found'), {userId: viewerId})
    }

    // VALIDATION
    const normalizedContent = normalizeRawDraftJS(content)
    const plaintextContent = extractTextFromDraftString(normalizedContent)
    const isVeryDifferent = Math.abs(plaintextContent.length - reflection.plaintextContent.length) > 2
    const entities = isVeryDifferent ? await getReflectionEntities(plaintextContent) : reflection.entities

    // RESOLUTION
    await r
      .table('RetroReflection')
      .get(reflectionId)
      .update({
        content: normalizedContent,
        entities,
        plaintextContent,
        updatedAt: now
      })

    const data = {meetingId, reflectionId}
    publish(SubscriptionChannel.TEAM, teamId, UpdateReflectionContentPayload, data, subOptions)
    return data
  }
}
