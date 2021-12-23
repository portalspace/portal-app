import { useCallback, useMemo, useState, useEffect } from 'react'

import { useWeb3React } from './useWeb3'
import { calculateGasMargin } from '../utils/web3'
import { REMOVE_AFTER_MS } from '../constants/popup'
import { useNftBridgeContract } from './useContract'
import { useTransactionAdder, useHasPendingGenerate } from '../state/transactions/hooks'
import { useAddPopup } from '../state/application/hooks'
import { useSelectedState } from '../state/selected/hooks'

export const GenerateState = {
  UNKNOWN: 'UNKNOWN',
  PENDING: 'PENDING',
  IDLE: 'IDLE',
}

export function useGenerateTokenIdCallback() {
  const { chainId, account } = useWeb3React()
  const addPopup = useAddPopup()
  const BridgeContract = useNftBridgeContract()
  const addTransaction = useTransactionAdder()
  const selected = useSelectedState()

  const contractAddress = useMemo(() => {
    return selected.collection.contract
  }, [selected])

  const pendingGenerate = useHasPendingGenerate(contractAddress)
  const generateState = useMemo(() => {
    if (!account || !chainId || !contractAddress) return GenerateState.UNKNOWN
    return pendingGenerate
      ? GenerateState.PENDING
      : GenerateState.IDLE
  }, [account, chainId, contractAddress, pendingGenerate])

  const generate = useCallback(async () => {
    if (generateState === GenerateState.UNKNOWN) {
      console.error('generate arguments are incomplete')
      return
    }

    if (generateState === GenerateState.PENDING) {
      console.error('tx is already pending')
      return
    }

    if (!BridgeContract) {
      console.error('BridgeContract is null')
      return
    }

    try {
      const estimatedGas = await BridgeContract.estimateGas['addMainToken'](contractAddress)
      return BridgeContract['addMainToken'](contractAddress, {
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
              method: 'Generate',
            },
            // special event so we can check when generate has succeeded
            generate: {
              contractAddress,
            },
          })

          addPopup({
            content: {
              success: true,
              summary: {
                eventName: 'message',
                message: 'Generate transaction submitted',
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
                message: 'Failed to generate tokenID',
              },
            },
            removeAfterMs: REMOVE_AFTER_MS,
          })
        })
    } catch (err) {
      console.error(err)
      return
    }
  }, [generateState, BridgeContract, contractAddress])

  return [generateState, generate]
}
