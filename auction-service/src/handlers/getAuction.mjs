import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../utils/middleware.mjs";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event) {
  const { id = "" } = event.pathParameters;
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
    throw new createError.InternalServerError(error);
  }

  if (!auction)
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
