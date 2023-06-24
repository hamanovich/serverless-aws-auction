import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import validator from '@middy/validator';
import createAuctionSchema from '../schemas/createAuctionSchema.mjs';
import commonMiddleware from '../utils/middleware.mjs';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event) {
  const { title } = event.body;
  const { email: seller } = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: 'ACTIVE',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller,
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export default commonMiddleware(createAuction).use(
  validator({
    eventSchema: createAuctionSchema,
  }),
);
