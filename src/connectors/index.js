import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'

import PORTAL_LOGO_URL from '../assets/images/logo.png'
import { NETWORK_URLS, WALLETCONNECT_BRIDGE_URL, SUPPORTED_CHAIN_IDS, SUPPORTED_CHAINS_BY_NAME } from '../constants/network'
import { INFURA_KEY, FORMATIC_KEY, PORTIS_ID } from '../constants/keys'

if (!INFURA_KEY || typeof INFURA_KEY === 'undefined') {
  throw new Error('NEXT_PUBLIC_INFURA_KEY must be a defined environment variable')
}

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1,
})

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  qrcode: true,
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1,
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[SUPPORTED_CHAINS_BY_NAME.MAINNET],
  appName: 'Portal Space',
  appLogoUrl: PORTAL_LOGO_URL,
})
