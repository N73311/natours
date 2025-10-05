// AWS SES Email Service for containerized deployment
const AWS = require('aws-sdk');
const pug = require('pug');
const htmlToText = require('html-to-text');
const capitalize = require('./capitalize');

// Configure AWS SES
const ses = new AWS.SES({
  region: process.env.AWS_REGION || 'us-east-1'
});

class SESEmail {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = capitalize(user.name.toLowerCase().split(' ')[0]);
    this.url = url;
    this.from = process.env.EMAIL_FROM || 'Natours <natours@zachayers.io>';
  }

  // Send the actual email
  async send(template, subject) {
    try {
      // 1) Render HTML based on pug template
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      // 2) Convert HTML to plain text
      const text = htmlToText.fromString(html);

      // 3) Create SES email parameters
      const params = {
        Destination: {
          ToAddresses: [this.to]
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: html
            },
            Text: {
              Charset: 'UTF-8',
              Data: text
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject
          }
        },
        Source: this.from,
        ReplyToAddresses: [this.from.match(/<(.+)>/)?.[1] || this.from]
      };

      // 4) Send email via SES
      await ses.sendEmail(params).promise();

      console.log(`Email sent successfully to ${this.to}`);
    } catch (error) {
      console.error('SES Email Error:', error);
      // In production, you might want to throw this error
      // For demo purposes, we'll log it but continue
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Email could not be sent: ${error.message}`);
      }
    }
  }

  // Send welcome email
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  // Send password reset email
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }
}

module.exports = SESEmail;