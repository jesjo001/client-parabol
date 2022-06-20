import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {PreloadedQuery, usePreloadedQuery} from 'react-relay'
import useActiveTopTemplate from '../../../hooks/useActiveTopTemplate'
import {ReflectTemplateListPublicQuery} from '../../../__generated__/ReflectTemplateListPublicQuery.graphql'
import ReflectTemplateItem from './ReflectTemplateItem'

const TemplateList = styled('ul')({
  listStyle: 'none',
  paddingLeft: 0,
  marginTop: 0
})

interface Props {
  queryRef: PreloadedQuery<ReflectTemplateListPublicQuery>
}

const query = graphql`
  query ReflectTemplateListPublicQuery($teamId: ID!) {
    viewer {
      id
      team(teamId: $teamId) {
        id
        meetingSettings(meetingType: retrospective) {
          ... on RetrospectiveMeetingSettings {
            templateSearchQuery
            publicTemplates(first: 50)
              @connection(key: "ReflectTemplateListPublic_publicTemplates") {
              edges {
                node {
                  ...ReflectTemplateItem_template
                  id
                  name
                }
              }
            }
            activeTemplate {
              id
            }
          }
        }
      }
    }
  }
`

const ReflectTemplateListPublic = (props: Props) => {
  const {queryRef} = props
  const data = usePreloadedQuery<ReflectTemplateListPublicQuery>(query, queryRef, {
    UNSTABLE_renderPolicy: 'full'
  })
  const {viewer} = data
  const team = viewer.team!
  const {id: teamId, meetingSettings} = team
  const {templateSearchQuery, publicTemplates, activeTemplate} = meetingSettings
  const activeTemplateId = activeTemplate?.id ?? '-tmp'
  const {edges} = publicTemplates!
  const filteredEdges = edges.filter(({node}) =>
    node.name.toLowerCase().includes(templateSearchQuery ?? '')
  )
  useActiveTopTemplate(edges, activeTemplateId, teamId, true, 'retrospective')
  return (
    <TemplateList>
      {filteredEdges.map(({node: template}) => {
        return (
          <ReflectTemplateItem
            key={template.id}
            template={template}
            isActive={template.id === activeTemplateId}
            lowestScope={'PUBLIC'}
            teamId={teamId}
          />
        )
      })}
    </TemplateList>
  )
}

export default ReflectTemplateListPublic
