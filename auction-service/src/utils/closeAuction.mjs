import AWS from 'aws-sdk';
import logger from '../libs/logger.mjs';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuction(auction) {
  await dynamodb
    .update({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id: auction.id },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeValues: {
        ':status': 'CLOSED',
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    })
    .promise();

  const {
    title,
    seller,
    highestBid: { amount, bidder },
  } = auction;

  if (amount === 0) {
    return await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'No bids on your auction item ;(',
          recipient: seller,
          body: `Oh no! Your item "${title}" didn't get any bids.`,
        }),
      })
      .promise();
  }

  logger.info({ title, seller, amount, bidder });

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'Your item has been sold!',
        recipient: seller,
        body: `Woohoo! Your item "${title}" has been sold for $${amount}.`,
      }),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'You won an auction!',
        recipient: bidder,
        body: `What a great deal! You got yourself a "${title}" for $${amount}`,
      }),
    })
    .promise();

  return Promise.all([notifySeller, notifyBidder]);
}
