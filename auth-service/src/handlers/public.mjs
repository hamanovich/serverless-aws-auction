import commonMiddleware from '../utils/middleware.mjs';

function publicEndpoint() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Public Endpoint',
    }),
  };
}

export default commonMiddleware(publicEndpoint);
