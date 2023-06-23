import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../utils/middleware.mjs';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions() {
  let auctions;

  try {
    const { Items } = await dynamodb.scan({ TableName: process.env.AUCTIONS_TABLE_NAME }).promise();

    auctions = Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions);
