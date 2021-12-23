export const RATE_LIMIT_MAPPING = {
  'default': {
    reservoir: 60,
    reservoirRefreshAmount: 15,
    reservoirRefreshInterval: 60 * 1000, // the 'per minute', must be divisible by 250
    maxConcurrent: 5,
  },
  // TODO: figure out a proper rate limit for this
  'ipfs.io': {
    reservoir: 15,
    reservoirRefreshAmount: 15,
    reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 1,
  },
  // https://docs.pinata.cloud/rate-limits
  'gateway.pinata.cloud': {
    reservoir: 15,
    reservoirRefreshAmount: 15,
    reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 1,
  },
  // https://github.community/t/raw-githubusercontent-com-rate-limit/142444
  'raw.githubusercontent.com': {
    reservoir: 60,
    reservoirRefreshAmount: 60,
    reservoirRefreshInterval: 60 * 60 * 1000, // per hour
    maxConcurrent: 1,
  },
}
