import React, {Suspense} from 'react'
import newMeetingQuery, {NewMeetingQuery} from '~/__generated__/NewMeetingQuery.graphql'
import useQueryLoaderNow from '../hooks/useQueryLoaderNow'
import useRouter from '../hooks/useRouter'
import useSubscription from '../hooks/useSubscription'
import NotificationSubscription from '../subscriptions/NotificationSubscription'
import OrganizationSubscription from '../subscriptions/OrganizationSubscription'
import TaskSubscription from '../subscriptions/TaskSubscription'
import TeamSubscription from '../subscriptions/TeamSubscription'
import {renderLoader} from '../utils/relay/renderLoader'
import NewMeeting from './NewMeeting'

const NewMeetingRoot = () => {
  const {match} = useRouter<{teamId: string}>()
  const {params} = match
  const {teamId} = params
  useSubscription('NewMeetingRoot', NotificationSubscription)
  useSubscription('NewMeetingRoot', OrganizationSubscription)
  useSubscription('NewMeetingRoot', TaskSubscription)
  useSubscription('NewMeetingRoot', TeamSubscription)
  const queryRef = useQueryLoaderNow<NewMeetingQuery>(newMeetingQuery, {teamId})
  return (
    <Suspense fallback={renderLoader()}>
      {queryRef && <NewMeeting teamId={teamId} queryRef={queryRef} />}
    </Suspense>
  )
}

export default NewMeetingRoot
