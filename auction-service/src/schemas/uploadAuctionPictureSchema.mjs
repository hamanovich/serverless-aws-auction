import { transpileSchema } from '@middy/validator/transpile';

export default transpileSchema({
  type: 'object',
  properties: {
    body: {
      type: 'string',
      minLength: 1,
      pattern: '^data:image',
    },
  },
  required: ['body'],
});
