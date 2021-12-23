import { useCallback, useMemo, useState } from 'react'

import { useWeb3React } from './useWeb3'
import { calculateGasMargin } from '../utils/web3'
import { MuonClient, MUON_NETWORK_NAMES_BY_CHAIN_ID } from '../constants/muon'
import { BRIDGE_CONTRACTS_BY_CHAIN_ID } from '../constants/contracts'
import { REMOVE_AFTER_MS } from '../constants/popup'
import { useNftBridgeContract } from './useContract'
import { useTransactionAdder, useHasPendingClaim } from '../state/transactions/hooks'
import { useAddPopup } from '../state/application/hooks'

export const ClaimState = {
  UNKNOWN: 'UNKNOWN',
  LOADING: 'LOADING',
  PENDING: 'PENDING',
  IDLE: 'IDLE',
}

export function useClaimCallback (selectedTokenId, selectedNftId) {
  const { chainId, account } = useWeb3React()
  const [ contractPayload, setContractPayload ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const addPopup = useAddPopup()
  const pendingClaim = useHasPendingClaim(selectedTokenId, selectedNftId)

  const fetchContractPayload = async ({
    nftId,
    fromChain,
    toChain,
    tokenId,
    txId,
  }) => {
    try {
      setLoading(true)
      const depositAddress = BRIDGE_CONTRACTS_BY_CHAIN_ID[fromChain] ?? null
      const depositNetwork = MUON_NETWORK_NAMES_BY_CHAIN_ID[fromChain] ?? null
      if (!depositAddress || !depositNetwork) return null

      const response = await MuonClient.app('nft_bridge').method('claim', {
        depositAddress,
        depositNetwork,
        depositTxId: txId,
      }).call()

      // https://github.com/muon-protocol/muon-nft-bridge-contracts/blob/master/contracts/MuonNFTBridge.sol#L136
      const payload = [
        account,
        // response?.data?.result?.nftId, // use this when claiming multiple nftIds
        [nftId],
        [
          response?.data?.result?.fromChain,
          response?.data?.result?.toChain,
          response?.data?.result?.tokenId,
          response?.data?.result?.txId,
        ],
        response?.reqId,
        response?.sigs
      ].filter(o => o)

      if (payload.length !== 5) {
        console.error('payload is missing arguments: ', payload)
        return null
      }

      console.log(payload);
      setLoading(false)
      return payload
    } catch (err) {
      setLoading(false)
      console.error(err)
      return null
    }
  }

  const claimState = useMemo(() => {
    if (loading) return ClaimState.LOADING
    if (!account || !chainId) return ClaimState.UNKNOWN

    return pendingClaim
      ? ClaimState.PENDING
      : ClaimState.IDLE
  }, [account, chainId, contractPayload, loading, pendingClaim])

  const BridgeContract = useNftBridgeContract()
  const addTransaction = useTransactionAdder()

  const claim = useCallback(async ({
    contractAddress,
    nftId,
    fromChain,
    toChain,
    tokenId,
    txId,
    name,
    symbol,
    isMuon,
  }) => {
    if (claimState === ClaimState.UNKNOWN) {
      console.error('claim arguments are unknown')
      return
    }

    if (claimState === ClaimState.PENDING) {
      console.error('tx is already pending')
      return
    }

    if (!BridgeContract) {
      console.error('BridgeContract is null')
      return
    }

    if (!contractAddress) {
      console.error('contractAddress is null')
      return
    }

    if (!nftId) {
      console.error('nftId is null')
      return
    }

    if (!fromChain) {
      console.error('fromChain is null')
      return
    }

    if (!toChain) {
      console.error('toChain is null')
      return
    }

    if (!tokenId && tokenId !== 0) {
      console.error('tokenId is null')
      return
    }

    // txId can be 0
    if (txId === undefined) {
      console.error('txId is undefined')
      return
    }

    try {
      const contractPayload = await fetchContractPayload({
        nftId,
        fromChain,
        toChain,
        tokenId,
        txId,
      })
      if (!contractPayload) {
        console.error('contractPayload is null')
        return
      }

      console.log(contractPayload);
      const estimatedGas = await BridgeContract.estimateGas['claim'](...contractPayload)
      return BridgeContract['claim'](...contractPayload, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
        .then(response => {
          console.log(response)
          // start listening for receipt
          addTransaction({
            hash: response.hash,
            summary: {
              // for the popup
              fromChain,
              toChain,
              contractAddress,
              nftId,
              name,
              symbol,
              isMuon,
              // for transaction poller
              chainId,
              hash: response.hash,
              method: 'Claim',
            },
            // special event so we can check when the claim has succeeded
            claim: {
              tokenId,
              nftId
            },
          })

          addPopup({
            content: {
              success: true,
              summary: {
                eventName: 'message',
                message: 'Claim transaction submitted',
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
                message: 'Failed to claim NFT',
              },
            },
            removeAfterMs: REMOVE_AFTER_MS,
          })
        })
    } catch (err) {
      console.error(err)
      return
    }
  }, [claimState, BridgeContract, chainId])

  return [claimState, claim]
}
