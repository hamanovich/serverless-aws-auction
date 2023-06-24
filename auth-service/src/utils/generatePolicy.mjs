export default function generatePolicy(principalId, methodArn) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: methodArn.split('/', 2).join('/') + '/*',
        },
      ],
    },
  };
}
