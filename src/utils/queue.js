import Bottleneck from 'bottleneck'

import { RATE_LIMIT_MAPPING } from '../constants/ratelimit'

class Etherscan {
  constructor() {
    this.limiter = new Bottleneck({
      reservoir: 5,
      reservoirRefreshAmount: 5,
      reservoirRefreshInterval: 1 * 1000,
      maxConcurrent: 5,
    })
  }

  // When adding to the queue use this method, takes in a promise. Read the documentation of 'bottleneck' if you want to use async/await or callbacks instead.
  add(promise) {
    return this.limiter.schedule(promise)
  }
}

class UrlQueue {
  constructor(config) {
    this.limiter = new Bottleneck(config)
  }

  add(promise) {
    return this.limiter.schedule(promise)
  }
}

export const EtherscanQueue = new Etherscan()
export const PolygonScanQueue = new Etherscan()
export const BscScanQueue = new Etherscan()

export const UrlQueueMapping = Object.entries(RATE_LIMIT_MAPPING).reduce((acc, [key, config]) => {
  acc[key] = new UrlQueue(config)
  return acc
}, {})
