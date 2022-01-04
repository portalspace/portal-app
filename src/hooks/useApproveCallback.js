import { useCallback, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import { useWeb3React } from './useWeb3'
import { useERC721Contract } from './useContract'
import { useERC721Allowance } from './useERC721Allowance'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { useAddPopup } from '../state/application/hooks'
import { REMOVE_AFTER_MS } from '../constants/popup'
import { BRIDGE_CONTRACTS_BY_CHAIN_ID } from '../constants/contracts'
import { calculateGasMargin } from '../utils/web3'

export const ApprovalState = {
  UNKNOWN: 'UNKNOWN',
  NOT_APPROVED: 'NOT_APPROVED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
}

export function useApproveCallback(tokenAddress) {
  const { chainId, account } = useWeb3React()
  const spender = BRIDGE_CONTRACTS_BY_CHAIN_ID[chainId]
  const currentAllowance = useERC721Allowance(tokenAddress, spender)
  const pendingApproval = useHasPendingApproval(tokenAddress, spender)
  const addPopup = useAddPopup()
  const TokenContract = useERC721Contract(tokenAddress)
  const addTransaction = useTransactionAdder()

  const approvalState = useMemo(() => {
    if (!tokenAddress) return ApprovalState.UNKNOWN
    if (!spender) return ApprovalState.UNKNOWN

    return currentAllowance.gt(0)
      ? ApprovalState.APPROVED
      : pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
  }, [tokenAddress, spender, currentAllowance, pendingApproval])

  const approve = useCallback(async () => {
    if (approvalState === ApprovalState.APPROVED || approvalState === ApprovalState.PENDING) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!TokenContract) {
      console.error('TokenContract is null')
      return
    }

    if (!account) {
      console.error('account is null')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    const estimatedGas = await TokenContract.estimateGas.setApprovalForAll(spender, true)
    return TokenContract
      .setApprovalForAll(spender, true, {
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
            method: 'Approval',
          },
          // special event so we can check when the approval has succeeded
          approval: { tokenAddress: tokenAddress, spender: spender },
        })

        addPopup({
          content: {
            success: true,
            summary: {
              eventName: 'message',
              message: 'Approval transaction submitted',
            },
          },
          removeAfterMs: REMOVE_AFTER_MS,
        })
      })
      .catch(error => {
        console.error('Failed to approve token for an unknown reason', error)
        if (error.code === 4001) return  // user rejected tx
        addPopup({
          content: {
            success: false,
            summary: {
              eventName: 'message',
              message: 'Failed to approve token',
            },
          },
          removeAfterMs: REMOVE_AFTER_MS,
        })
      })
  }, [approvalState, TokenContract, spender, addTransaction, chainId, addPopup, account])

  return [approvalState, approve]
}
