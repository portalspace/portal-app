import { useCallback, useMemo } from 'react'

import { useWeb3React } from './useWeb3'
import { calculateGasMargin } from '../utils/web3'
import { REMOVE_AFTER_MS } from '../constants/popup'
import { useNftBridgeContract } from './useContract'
import { useTransactionAdder, useHasPendingDeposit } from '../state/transactions/hooks'
import { useAddPopup } from '../state/application/hooks'
import { useSelectedState } from '../state/selected/hooks'

export const DepositState = {
  UNKNOWN: 'UNKNOWN',
  PENDING: 'PENDING',
  IDLE: 'IDLE',
}

export function useDepositCallback () {
  const { chainId, account } = useWeb3React()
  const addPopup = useAddPopup()
  const selected = useSelectedState()

  const [targetChainId, contractAddress, name, symbol, isMuon, nftId, tokenId] = useMemo(() => {
    return [
      selected.chain.target,
      selected.collection.contract,
      selected.collection.name,
      selected.collection.symbol,
      selected.collection.isMuon,
      selected.nftId,
      selected.tokenId,
    ]
  }, [selected])

  const pendingDeposit = useHasPendingDeposit(contractAddress, nftId)
  const depositState = useMemo(() => {
    if (!account || !chainId) return DepositState.UNKNOWN
    return pendingDeposit
      ? DepositState.PENDING
      : DepositState.IDLE
  }, [account, chainId, pendingDeposit])

  const BridgeContract = useNftBridgeContract()
  const addTransaction = useTransactionAdder()

  const deposit = useCallback(async () => {
    if (depositState === DepositState.UNKNOWN) {
      console.error('deposit arguments are unknown')
      return
    }

    if (depositState === DepositState.PENDING) {
      console.error('tx is already pending')
      return
    }

    if (!BridgeContract) {
      console.error('BridgeContract is null')
      return
    }

    if (!nftId) {
      console.error('nftId is null')
      return
    }

    if (!targetChainId) {
      console.error('targetChainId is null')
      return
    }

    if (!tokenId) {
      console.error('tokenId is null')
      return
    }

    if (!contractAddress) {
      console.error('contractAddress is null')
      return
    }

    try {
      // https://github.com/muon-protocol/muon-nft-bridge-contracts/blob/master/contracts/MuonNFTBridge.sol#L88
      const contractPayload = [
        [
          nftId
        ],
        targetChainId,
        tokenId,
      ]
      const estimatedGas = await BridgeContract.estimateGas['deposit'](...contractPayload)
      return BridgeContract['deposit'](...contractPayload, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
        .then(response => {
          console.log(response)
          // start listening for receipt
          addTransaction({
            hash: response.hash,
            summary: {
              // for the popup
              fromChain: chainId,
              toChain: targetChainId,
              contractAddress,
              nftId,
              name,
              symbol,
              isMuon,
              // for transaction poller
              chainId: chainId,
              hash: response.hash,
              method: 'Deposit',
            },
            // special event so we can check when the deposit has succeeded
            deposit: {
              contractAddress,
              nftId
            },
          })

          addPopup({
            content: {
              success: true,
              summary: {
                eventName: 'message',
                message: 'Deposit transaction submitted',
              },
            },
            removeAfterMs: REMOVE_AFTER_MS,
          })
        })
        .catch(error => {
          if (error.code === 4001) return  // user rejected tx
          console.error('Failed to conduct tx for an unknown reason', error)
          addPopup({
            content: {
              success: false,
              summary: {
                eventName: 'message',
                message: `Failed to bridge #${nftId}`,
              },
            },
            removeAfterMs: REMOVE_AFTER_MS,
          })
        })
    } catch (err) {
      console.error(err)
      return
    }
  }, [depositState, BridgeContract, chainId, nftId, targetChainId, tokenId])

  return [depositState, deposit]
}
