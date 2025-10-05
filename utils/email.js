// IMPORT MODULES
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const capitalize = require('./capitalize');

// Use AWS SES if running in container/production with IAM role
if (process.env.USE_AWS_SES === 'true' || process.env.AWS_EXECUTION_ENV) {
  module.exports = require('./sesEmail');
  return;
}

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = capitalize(user.name.toLowerCase().split(' ')[0]);
    this.url = url;
    this.from = `Natours Support <${process.env.EMAIL_FROM}`;
  }

  //* NEW TRANSPORT
  newTransport() {
    // NODEMAILER TO MAILTRAP (for local development)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //* SEND
  async send(template, subject) {
    // Render HTML for the email - based on a PUG template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  //* SEND WELCOME
  async sendWelcome() {
    await this.send('welcome', 'Welcome To Natours!');
  }

  //* PASSWORD RESTET
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your Password Reset Token (Valid For 10 Minutes)'
    );
  }
};
