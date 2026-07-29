import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import { common } from './styles'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You&apos;ve been invited to join {siteName}</Preview>
    <Body style={common.main}>
      <Container style={common.container}>
        <Heading style={common.h1}>You&apos;ve been invited</Heading>
        <Text style={common.text}>
          You&apos;ve been invited to join{' '}
          <Link href={siteUrl} style={common.link}>
            <strong>{siteName}</strong>
          </Link>
          . Click the button below to accept the invitation and create your
          account.
        </Text>
        <Button style={common.button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={common.footer}>
          If you weren&apos;t expecting this invitation, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail
