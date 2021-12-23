import { useMemo, useCallback } from 'react'
import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'
import { Multicall } from 'ethereum-multicall'

import { useWeb3React } from './useWeb3'
import ERC20_ABI from '../constants/abi/ERC20.json'
import ERC721_ABI from '../constants/abi/ERC721.json'
import NFT_BRIDGE_ABI from '../constants/abi/NFT_BRIDGE.json'
import { BRIDGE_CONTRACTS_BY_CHAIN_ID } from '../constants/contracts'
import { PROVIDERS_BY_CHAIN_ID } from '../constants/providers'

export const useContract = (address, ABI, withSignerIfPossible = true) => {
  const { library, account, chainId } = useWeb3React()
  return useMemo(() => {
    try {
      if (!address || !ABI || !library || !chainId || !account) return null
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (err) {
      console.error('Failed to get contract: ', err)
      return null
    }
  }, [address, library, chainId, ABI, withSignerIfPossible, account])
}

export const useERC721Contract = (tokenAddress, withSignerIfPossible) => {
  return useContract(tokenAddress, ERC721_ABI, withSignerIfPossible)
}

export const useERC20Contract = (tokenAddress, withSignerIfPossible) => {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export const useNftBridgeContract = (targetChainId) => {
  const { library, account, chainId } = useWeb3React()
  return useMemo(() => {
    try {
      if (!library || !chainId || !account) return null

      const address = (targetChainId)
        ? BRIDGE_CONTRACTS_BY_CHAIN_ID[targetChainId]
        : BRIDGE_CONTRACTS_BY_CHAIN_ID[chainId]
      if (!address) throw new Error(`targetChainId ${targetChainId} is not supported`)

      return getContract(address, NFT_BRIDGE_ABI, library, account ?? undefined, targetChainId)
    } catch (err) {
      console.error('Failed to get NFT Bridge contract: ', err)
      return null
    }
  }, [library, chainId, account, targetChainId])
}

export const useMulticallContract = () => {
  const { library, account, chainId } = useWeb3React()
  return useCallback((targetChainId) => {
    try {
      if (!library || !chainId || !account) return null
      const provider = (targetChainId)
        ? PROVIDERS_BY_CHAIN_ID[targetChainId]
        : getProviderOrSigner(library, account).provider

      if (!provider) throw new Error('Unable to pick provider')
      return new Multicall({ ethersProvider: provider, tryAggregate: true })
    } catch (err) {
      console.error('Failed to get Multicall contract: ', err)
      return null
    }
  }, [library, account, chainId])
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

const getContract = (address, ABI, library, account, targetChainId) => {
  if (!isAddress(address) || address === AddressZero) {
    throw new Error(`Invalid 'address' parameter '${address}'.`)
  }
  if (targetChainId) {
    return new Contract(address, ABI, PROVIDERS_BY_CHAIN_ID[targetChainId].getSigner(account))
  } else {
    return new Contract(address, ABI, getProviderOrSigner(library, account))
  }
}
