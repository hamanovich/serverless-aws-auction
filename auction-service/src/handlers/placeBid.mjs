import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import validator from '@middy/validator';
import placeBidSchema from '../schemas/placeBidSchema.mjs';
import commonMiddleware from '../utils/middleware.mjs';
import { getAuctionById } from '../utils/getAuctionById.mjs';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;
  let updateAuction;

  const auction = await getAuctionById(id);
  const { amount: currentAmount } = auction.highestBid;

  if (email === auction.seller) throw new createHttpError.Forbidden(`You can't bid on your own auctions!`);
  if (email === auction.highestBid.bidder) throw new createHttpError.Forbidden(`You are already the highest bidder!`);
  if (auction.status !== 'ACTIVE') throw new createHttpError.Forbidden(`You can't bid on close auctions`);
  if (amount <= currentAmount) throw new createHttpError.Forbidden(`Your bid must be hight than ${currentAmount}`);

  try {
    const { Attributes } = await dynamodb
      .update({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
          ':amount': amount,
          ':bidder': email,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    updateAuction = Attributes;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updateAuction),
  };
}

export default commonMiddleware(placeBid).use(
  validator({
    eventSchema: placeBidSchema,
  }),
);
