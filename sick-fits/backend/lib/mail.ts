import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeEmail(text: string): string {
  return `
    <div style="
        border:1px solid black;
        passing: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px
    ">
        <h2>Hi</h2>
        <p>${text}</p>
        <p>Tom</p>
    </div>`;
}

interface Envelope {
  from: string;
  to: string[];
}

interface MailResponse {
  accepted: string[];
  rejected: unknown[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email user the token
  const info: MailResponse = await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Password Reset Email',
    html: makeEmail(`Your password reset token: 
    <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>`),
  });
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Message preview at ${getTestMessageUrl(info)}`);
  }
}
