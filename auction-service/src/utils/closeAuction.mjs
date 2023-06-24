import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auction) {
  return await dynamodb
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
}
