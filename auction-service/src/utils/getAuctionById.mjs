import createHttpError from 'http-errors';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;

  try {
    const { Item } = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = Item;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  if (!auction) throw new createHttpError.NotFound(`Auction with ID "${id}" not found!`);

  return auction;
}
