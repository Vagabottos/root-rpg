import { Application } from './declarations';

export default function(app: Application): any {
  async function sendEmail(email) {
    const res = await app.service('mailer').create(email);
  }

  const handlers = {
    sendResetPwd(type, user, notifierOptions) {
      const link = `https://${app.get('host')}/password-reset/${user.resetToken}`;

      return sendEmail({
        from: app.get('mail').from,
        to: user.email,
        subject: 'Reset Password',
        html: `Reset your password: <a href="${link}">${link}</a>`,
      });
    }
  };

  return (type, user, notifierOptions) => {
    if (type in handlers) {
      return handlers[type](type, user, notifierOptions);
    }
  };
}
