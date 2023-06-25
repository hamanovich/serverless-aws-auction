import AWS from 'aws-sdk';
import logger from '../libs/logger.mjs';

const ses = new AWS.SES({ region: process.env.AWS_PROVIDER_REGION });

async function sendMail(event) {
  const record = event.Records[0];
  const { subject, body, recipient } = JSON.parse(record.body);

  try {
    return await ses
      .sendEmail({
        Source: process.env.SEND_EMAIL_SOURCE,
        Destination: {
          ToAddresses: [recipient],
        },
        Message: {
          Body: {
            Text: {
              Data: body,
            },
          },
          Subject: {
            Data: subject,
          },
        },
      })
      .promise();
  } catch (error) {
    logger.error(error);
  }
}

export default sendMail;
