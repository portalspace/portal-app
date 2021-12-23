import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useDispatch } from 'react-redux'
import { UnsupportedChainIdError } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'
import { Activity } from 'react-feather'

import { useWeb3React } from '../../hooks/useWeb3'
import { useWalletModalToggle  } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { truncateAddress } from '../../utils/account'
import { NETWORK_CONTEXT_NAME } from '../../constants/network'

import { WalletModal } from '../WalletModal'
import { NavButton } from '../Button'
import { Connected as ConnectedIcon } from '../Icons'

const ConnectButton = styled(NavButton)`
`

const ConnectedButton = styled(NavButton)`
  & > * {
    &:first-child {
      margin-right: 5px;
    }
  }
`

const ErrorButton = styled(NavButton)`
  background: red;
  color: white;
`

const Text = styled.p`
  width: fit-content;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
`

// We want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a, b) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { account, error, connector } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <ConnectedButton onClick={toggleWalletModal}>
        <ConnectedIcon />
        <Text>{truncateAddress(account)}</Text>
      </ConnectedButton>
    )
  } else if (error) {
    return (
      <ErrorButton onClick={toggleWalletModal}>
        <Activity />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </ErrorButton>
    )
  } else {
    return (
      <ConnectButton onClick={toggleWalletModal} faded={!account}>
        <Text>Connect Wallet</Text>
      </ConnectButton>
    )
  }
}

export const Web3Status = () => {
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={'undefined'} pendingTransactions={pending} confirmedTransactions={confirmed}/>
    </>
  )
}
