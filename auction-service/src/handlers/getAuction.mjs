import commonMiddleware from '../libs/middleware.mjs';
import { getAuctionById } from '../utils/getAuctionById.mjs';

async function getAuction(event) {
  const { id = '' } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export default commonMiddleware(getAuction);
