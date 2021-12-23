import { useCallback, useMemo, useState, useEffect } from 'react'

import { useWeb3React } from './useWeb3'
import { calculateGasMargin } from '../utils/web3'
import { MuonClient, MUON_NETWORK_NAMES_BY_CHAIN_ID } from '../constants/muon'
import { REMOVE_AFTER_MS } from '../constants/popup'
import { BRIDGE_CONTRACTS_BY_CHAIN_ID } from '../constants/contracts'
import { useNftBridgeContract } from './useContract'
import { useTransactionAdder, useHasPendingDeployment } from '../state/transactions/hooks'
import { useAddPopup } from '../state/application/hooks'

export const DeployState = {
  UNKNOWN: 'UNKNOWN',
  LOADING: 'LOADING',
  PENDING: 'PENDING',
  IDLE: 'IDLE',
}

export function useDeployBridgeFactoryCallback (contractAddress, mainChainId, targetChainId, factoryIsDeployed) {
  const { chainId, account } = useWeb3React()
  const addPopup = useAddPopup()
  const [ contractPayload, setContractPayload ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const pendingDeployment = useHasPendingDeployment(contractAddress, targetChainId)

  const mainNetwork = useMemo(() => {
    return MUON_NETWORK_NAMES_BY_CHAIN_ID[mainChainId] ?? null
  }, [mainChainId])

  const targetNetwork = useMemo(() => {
    return MUON_NETWORK_NAMES_BY_CHAIN_ID[targetChainId] ?? null
  }, [targetChainId])

  const sourceBridge = useMemo(() => {
    return BRIDGE_CONTRACTS_BY_CHAIN_ID[mainChainId] ?? null
  }, [mainChainId])

  useEffect(() => {
    const fetchContractPayload = async () => {
      try {
        setLoading(true)
        const response = await MuonClient.app('nft_bridge').method('addBridgeToken', {
          mainTokenAddress: contractAddress,
          mainNetwork: mainNetwork,
          targetNetwork: targetNetwork,
          sourceBridge: sourceBridge,
        }).call()

        const payload = [
          response?.data?.result?.tokenId,
          response?.data?.result?.token?.name,
          response?.data?.result?.token?.symbol,
          response.reqId,
          response.sigs
        ].filter(o => o)
        if (payload.length !== 5) {
          console.error(payload)
          throw new Error('payload data is corrupted')
        }

        console.log(payload);
        setContractPayload(payload)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setContractPayload([])
        setLoading(false)
      }
    }

    if (contractAddress && mainNetwork && targetNetwork && sourceBridge && !factoryIsDeployed) {
      fetchContractPayload()
    } else {
      setContractPayload([])
    }
  }, [contractAddress, mainNetwork, targetNetwork, sourceBridge, factoryIsDeployed])

  const deployState = useMemo(() => {
    if (loading) return DeployState.LOADING
    if (!account || !chainId || !contractPayload.length) return DeployState.UNKNOWN
    return pendingDeployment
      ? DeployState.PENDING
      : DeployState.IDLE
  }, [loading, account, chainId, contractPayload, pendingDeployment])

  // Important we're already connected to the right chain
  const BridgeContract = useNftBridgeContract()
  const addTransaction = useTransactionAdder()

  const deploy = useCallback(async () => {
    if (deployState === DeployState.UNKNOWN) {
      console.error('deploy arguments are incomplete')
      return
    }

    if (deployState === DeployState.PENDING) {
      console.error('tx is already pending')
      return
    }

    if (!BridgeContract) {
      console.error('BridgeContract is null')
      return
    }

    try {
      const estimatedGas = await BridgeContract.estimateGas['addBridgeToken'](...contractPayload)
      return BridgeContract['addBridgeToken'](...contractPayload, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
        .then(response => {
          console.log(response)
          // start listening for receipt
          addTransaction({
            hash: response.hash,
            summary: {
              chainId: chainId,
              hash: response.hash,
              method: 'Deploy',
            },
            // special event so we can check when the deploy has succeeded
            deploy: {
              contractAddress,
              targetChainId
            },
          })

          addPopup({
            content: {
              success: true,
              summary: {
                eventName: 'message',
                message: 'Deploy transaction submitted',
              },
            },
            removeAfterMs: REMOVE_AFTER_MS,
          })
        })
        .catch(error => {
          console.error('Failed to conduct tx for an unknown reason', error)
          if (error.code === 4001) return  // user rejected tx
          addPopup({
            content: {
              success: false,
              summary: {
                eventName: 'message',
                message: 'Failed to deploy bridge factory',
              },
            },
            removeAfterMs: REMOVE_AFTER_MS,
          })
        })
    } catch (err) {
      console.error(err)
      return
    }
  }, [deployState, BridgeContract, contractPayload])

  return [deployState, deploy]
}
