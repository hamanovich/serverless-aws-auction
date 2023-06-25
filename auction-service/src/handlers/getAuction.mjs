import logger from '../libs/logger.mjs';
import commonMiddleware from '../libs/middleware.mjs';
import { getAuctionById } from '../utils/getAuctionById.mjs';

async function getAuction(event) {
  const { id = '' } = event.pathParameters;
  const auction = await getAuctionById(id);

  logger.info(auction);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export default commonMiddleware(getAuction);
