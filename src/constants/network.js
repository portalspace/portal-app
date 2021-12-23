import { invert } from 'lodash'

import { INFURA_KEY } from './keys'

export const NETWORK_CONTEXT_NAME = 'NETWORK'

export const SUPPORTED_CHAINS_BY_NAME = {
  // MAINNET: 1,
  RINKEBY: 4,
  // XDAI: 100,
  // FANTOM: 250,
  // BSC: 56,
  // BSC_TEST: 97,
  // POLYGON: 137,
  // AVALANCHE: 43114,
  MUMBAI: 80001,
}

export const BEAUTIFIED_CHAINS_BY_CHAIN_ID = {
  // [SUPPORTED_CHAINS_BY_NAME.MAINNET]: 'ETH',
  [SUPPORTED_CHAINS_BY_NAME.RINKEBY]: 'Rinkeby',
  // [SUPPORTED_CHAINS_BY_NAME.XDAI]: 'xDAI',
  // [SUPPORTED_CHAINS_BY_NAME.FANTOM]: 'FTM',
  // [SUPPORTED_CHAINS_BY_NAME.BSC]: 'BSC',
  // [SUPPORTED_CHAINS_BY_NAME.BSC_TEST]: 'tBSC',
  // [SUPPORTED_CHAINS_BY_NAME.POLYGON]: 'Polygon',
  // [SUPPORTED_CHAINS_BY_NAME.AVALANCHE]: 'AVAX',
  [SUPPORTED_CHAINS_BY_NAME.MUMBAI]: 'Mumbai',
}

export const NETWORK_URLS = {
  // [SUPPORTED_CHAINS_BY_NAME.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SUPPORTED_CHAINS_BY_NAME.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  // [SUPPORTED_CHAINS_BY_NAME.XDAI]: 'https://rpc.xdaichain.com/',
  // [SUPPORTED_CHAINS_BY_NAME.FANTOM]: 'https://rpc.ftm.tools/',
  // [SUPPORTED_CHAINS_BY_NAME.BSC]: 'https://bsc-dataseed.binance.org/',
  // [SUPPORTED_CHAINS_BY_NAME.BSC_TEST]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  // [SUPPORTED_CHAINS_BY_NAME.POLYGON]: 'https://rpc-mainnet.matic.quiknode.pro',
  // [SUPPORTED_CHAINS_BY_NAME.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [SUPPORTED_CHAINS_BY_NAME.MUMBAI]: 'https://rpc-mumbai.maticvigil.com/',
}

// Dont need to add mainnet to this list (there is a default)
export const NETWORK_POLLING_INTERVALS = {
  [SUPPORTED_CHAINS_BY_NAME.RINKEBY]: 5000,
  [SUPPORTED_CHAINS_BY_NAME.MUMBAI]: 5000,
}

export const RETRY_OPTIONS_BY_CHAIN_ID = {
  [SUPPORTED_CHAINS_BY_NAME.RINKEBY]: {
    n: 30,
    minWait: 1000,
    maxWait: 5000,
  },
  [SUPPORTED_CHAINS_BY_NAME.MUMBAI]: {
    n: 30,
    minWait: 500,
    maxWait: 3000,
  },
}

export const SUPPORTED_CHAINS_BY_ID = invert(SUPPORTED_CHAINS_BY_NAME)
export const SUPPORTED_CHAIN_IDS = Object.values(SUPPORTED_CHAINS_BY_NAME)
