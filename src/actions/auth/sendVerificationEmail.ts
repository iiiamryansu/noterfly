'use server'

import type { ReactElement } from 'react'

import { VerificationEmail } from '~/components/templates'
import { resend } from '~/lib/resend'

export async function sendVerificationEmail(email: string, otp: string): Promise<void> {
  await resend.emails.send({
    from: 'Noterfly <no-reply@resend.iamryansu.com>',
    react: VerificationEmail({ verificationCode: otp }) as ReactElement,
    subject: 'Verify your email',
    to: [email],
  })
}
