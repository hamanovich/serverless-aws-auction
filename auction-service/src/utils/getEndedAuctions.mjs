import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();

  const { Items } = await dynamodb
    .query({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      IndexName: 'statusAndEndDate',
      KeyConditionExpression: '#status = :status AND endingAt <= :now',
      ExpressionAttributeValues: {
        ':status': 'ACTIVE',
        ':now': now.toISOString(),
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    })
    .promise();

  return Items;
}
