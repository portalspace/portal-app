import { useCallback } from 'react'

import { useWeb3React } from './useWeb3'
import { SUPPORTED_CHAINS_BY_NAME } from '../constants/network'
import { RPC_PARAMS } from '../constants/rpc'

export const useRpcChangerCallback = () => {
  const { chainId } = useWeb3React()

  return useCallback(async (targetChainId) => {
    if (!chainId || !window.ethereum) return
    if (!targetChainId || !RPC_PARAMS[targetChainId]) return
    if (targetChainId === chainId) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: RPC_PARAMS[targetChainId].chainId }],
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          return await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [RPC_PARAMS[targetChainId]],
          })
        } catch (addError) {
          console.log('Something went wrong trying to add a new  network RPC: ')
          return console.error(addError)
        }
      }
      // handle other "switch" errors
      console.log('Unknown error occured when trying to change the network RPC: ')
      console.error(switchError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])
}
