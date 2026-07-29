import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import { common } from './styles'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={common.main}>
      <Container style={common.container}>
        <Heading style={common.h1}>Your login link</Heading>
        <Text style={common.text}>
          Click the button below to log in to {siteName}. This link will expire
          shortly.
        </Text>
        <Button style={common.button} href={confirmationUrl}>
          Log In
        </Button>
        <Text style={common.footer}>
          If you didn&apos;t request this link, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail
