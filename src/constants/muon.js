import Muon from 'muon'
import { SUPPORTED_CHAINS_BY_NAME } from './network'

export const MuonClient = new Muon(process.env.NEXT_PUBLIC_MUON_NODE_GATEWAY)

// https://github.com/muon-protocol/muon-node-js/blob/7fb51305f7a4315bf3a4e3d2e258ba37bb4111e3/utils/node-utils/eth.js
export const MUON_NETWORK_NAMES_BY_CHAIN_ID = {
  // [SUPPORTED_CHAINS_BY_NAME.MAINNET]: 'eth',
  [SUPPORTED_CHAINS_BY_NAME.RINKEBY]: 'rinkeby',
  // [SUPPORTED_CHAINS_BY_NAME.XDAI]: 'xdai',
  // [SUPPORTED_CHAINS_BY_NAME.FANTOM]: 'ftm',
  // [SUPPORTED_CHAINS_BY_NAME.BSC]: 'bsc',
  // [SUPPORTED_CHAINS_BY_NAME.BSC_TEST]: 'bsctest',
  // [SUPPORTED_CHAINS_BY_NAME.POLYGON]: 'polygon',
  // [SUPPORTED_CHAINS_BY_NAME.AVALANCHE]: 'AVAX', ///// does not exist
  [SUPPORTED_CHAINS_BY_NAME.MUMBAI]: 'mumbai',
}
