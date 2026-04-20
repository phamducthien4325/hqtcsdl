import NodeCache from "node-cache";

export const analyticsCache = new NodeCache({ stdTTL: 120, checkperiod: 150 });
