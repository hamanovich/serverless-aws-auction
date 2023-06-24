import { getEndedAuctions } from '../utils/getEndedAuctions.mjs';

async function processAuctions() {
  await getEndedAuctions();
}

export const handler = processAuctions;
