import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import generatePolicy from '../utils/generatePolicy.mjs';

export default async function auth(event) {
  if (!event.authorizationToken) throw new createHttpError.Unauthorized();

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
    const policy = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy,
      context: claims,
    };
  } catch (error) {
    throw new createHttpError.Unauthorized(error);
  }
}
