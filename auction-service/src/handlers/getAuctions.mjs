import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import getAuctionsSchema from '../schemas/getAuctionsSchema.mjs';
import commonMiddleware from '../utils/middleware.mjs';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event) {
  const { status } = event.queryStringParameters;
  let auctions;

  try {
    const { Items } = await dynamodb
      .query({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
          ':status': status,
        },
        ExpressionAttributeNames: {
          '#status': 'status',
        },
      })
      .promise();

    auctions = Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions).use(
  validator({
    eventSchema: getAuctionsSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  }),
);
