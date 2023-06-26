import { transpileSchema } from '@middy/validator/transpile';

export default transpileSchema({
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        duration: {
          type: 'number',
        },
      },
      required: ['title'],
    },
  },
  required: ['body'],
});
