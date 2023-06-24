import { transpileSchema } from '@middy/validator/transpile';

export default transpileSchema({
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
        },
      },
      required: ['amount'],
    },
  },
  required: ['body'],
});
