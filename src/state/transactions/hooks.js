import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { addTransaction } from './actions'

export function useTransactionAdder() {
  const { chainId, account } = useWeb3React()
  const dispatch = useDispatch()

  return useCallback(({ hash, summary, approval, deposit, claim, deploy, generate }) => {
    if (!account || !chainId) return

    if (!hash) {
      throw new Error('No transaction hash found.')
    }
    if (!summary) {
      throw new Error('Summary is missing.')
    }

    dispatch(addTransaction({ hash, from: account, chainId, summary, approval, deposit, claim, deploy, generate }))
  }, [dispatch, chainId, account])
}

// Returns all the transactions for the current chain
export function useAllTransactions() {
  const { chainId } = useWeb3React()

  const state = useSelector((state) => state.transactions)
  return chainId ? state[chainId] ?? {} : {}
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx) {
  return new Date().getTime() - tx.addedTime < 86400000
}

export function useIsTransactionPending(transactionHash) {
  const transactions = useAllTransactions()
  if (!transactionHash || !transactions[transactionHash]) return false
  return !transactions[transactionHash].receipt
}

export function useHasPendingClaim(tokenId, nftId) {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof tokenId === 'string' &&
      (typeof nftId === 'string' || typeof nftId === 'number') &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const claim = tx.claim
          if (!claim) return false
          return claim.tokenId === tokenId && claim.nftId === nftId && isTransactionRecent(tx)
        }
      }),
    [allTransactions, tokenId, nftId]
  )
}

export function useHasPendingDeposit(contractAddress, nftId) {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof contractAddress === 'string' &&
      (typeof nftId === 'string' || typeof nftId === 'number') &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const deposit = tx.deposit
          if (!deposit) return false
          return deposit.contractAddress === contractAddress && deposit.nftId === nftId && isTransactionRecent(tx)
        }
      }),
    [allTransactions, contractAddress, nftId]
  )
}

export function useHasPendingDeployment(contractAddress, targetChainId) {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof contractAddress === 'string' &&
      (typeof targetChainId === 'string' || typeof targetChainId === 'number') &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const deploy = tx.deploy
          if (!deploy) return false
          return deploy.contractAddress === contractAddress && deploy.targetChainId === targetChainId && isTransactionRecent(tx)
        }
      }),
    [allTransactions, contractAddress, targetChainId]
  )
}

export function useHasPendingGenerate(contractAddress) {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof contractAddress === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const generate = tx.generate
          if (!generate) return false
          return generate.contractAddress === contractAddress && isTransactionRecent(tx)
        }
      }),
    [allTransactions, contractAddress]
  )
}

export function useHasPendingApproval(tokenAddress, spender) {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const approval = tx.approval
          if (!approval) return false
          return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
        }
      }),
    [allTransactions, spender, tokenAddress]
  )
}
