import commonMiddleware from '../utils/middleware.mjs';

async function privateEndpoint(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      event,
      context,
    }),
  };
}

export default commonMiddleware(privateEndpoint);
