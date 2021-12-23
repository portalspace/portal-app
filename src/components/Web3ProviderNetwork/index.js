import { createWeb3ReactRoot } from '@web3-react/core'

import { NETWORK_CONTEXT_NAME } from '../../constants/network'

const Web3ReactProviderDefault = createWeb3ReactRoot(NETWORK_CONTEXT_NAME)

const Web3ReactProviderDefaultSSR = ({ children, getLibrary }) => {
  return <Web3ReactProviderDefault getLibrary={getLibrary}>{children}</Web3ReactProviderDefault>
}

export default Web3ReactProviderDefaultSSR
