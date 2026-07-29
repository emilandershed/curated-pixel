import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import { common } from './styles'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={common.main}>
      <Container style={common.container}>
        <Heading style={common.h1}>Confirm reauthentication</Heading>
        <Text style={common.text}>Use the code below to confirm your identity:</Text>
        <Text style={common.code}>{token}</Text>
        <Text style={common.footer}>
          This code will expire shortly. If you didn&apos;t request this, you can
          safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail
