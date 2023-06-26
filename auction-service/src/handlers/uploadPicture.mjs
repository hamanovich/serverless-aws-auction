import logger from '../libs/logger.mjs';
import createHttpError from 'http-errors';
import validator from '@middy/validator';
import uploadAuctionPictureSchema from '../schemas/uploadAuctionPictureSchema.mjs';
import commonMiddleware from '../libs/middleware.mjs';
import { getAuctionById } from '../utils/getAuctionById.mjs';
import { uploadPictureToS3 } from '../utils/uploadPictureToS3.mjs';
import { setAuctionPictureUrl } from '../utils/setAuctionPictureUrl.mjs';

async function uploadPicture(event) {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  let updatedAuction;

  if (auction.seller !== email) throw new createHttpError.Forbidden(`You are not the seller of this auction!`);

  try {
    const pictureUrl = await uploadPictureToS3(`${auction.id}.jpg`, buffer);
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
  } catch (error) {
    logger.error(error, 'Image was not uploaded');
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export default commonMiddleware(uploadPicture).use(
  validator({
    eventSchema: uploadAuctionPictureSchema,
  }),
);
