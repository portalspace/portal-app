import { JsonRpcProvider } from '@ethersproject/providers'

import { NETWORK_URLS } from './network'

export const PROVIDERS_BY_CHAIN_ID = Object.entries(NETWORK_URLS).reduce((acc, [chainId, rpc]) => {
  acc[chainId] = new JsonRpcProvider(rpc)
  return acc
}, {})
