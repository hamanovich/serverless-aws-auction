import { transpileSchema } from '@middy/validator/transpile';

export default transpileSchema({
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['ACTIVE', 'CLOSED'],
          default: 'ACTIVE',
        },
      },
    },
  },
  required: ['queryStringParameters'],
});
