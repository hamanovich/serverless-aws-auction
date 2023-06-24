import createHttpError from 'http-errors';
import { getEndedAuctions } from '../utils/getEndedAuctions.mjs';
import { closeAuction } from '../utils/closeAuction.mjs';

async function processAuctions() {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) => closeAuction(auction));

    await Promise.all[closePromises];

    return { closed: closePromises.length };
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }
}

export default processAuctions;
