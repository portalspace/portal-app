import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { getApolloClient } from '../../apollo/client/health'
import { getSubgraphName } from '../../apollo/client/bridge'
import { SUBGRAPH_HEALTH } from '../../apollo/queries'
import { useWeb3React } from '../../hooks/useWeb3'
import { isTransactionRecent, useAllTransactions } from '../transactions/hooks'
import { useEntriesState } from '../entries/hooks'
import { fetchEntries } from '../entries/reducer'
import { fetchTokens } from '../tokens/reducer'
import { useBlockNumber } from '../application/hooks'

// We want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a, b) {
  return b.addedTime - a.addedTime
}

export default function Updater() {
  const { account, chainId } = useWeb3React()
  const blockNumber = useBlockNumber()
  const dispatch = useDispatch()
  const allTransactions = useAllTransactions()
  const entries = useEntriesState()

  const subgraphName = useMemo(() => {
    return chainId ? getSubgraphName(chainId) : null
  }, [chainId])

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const targetBlockNumber = useMemo(() => {
    const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.receipt)
    return confirmed.length > 0 ? confirmed[0]['blockNumber'] : null
  })

  const blockOnLastFetch = useMemo(() => {
    return entries.blockNumber
  }, [entries])

  const fetchSyncedBlock = useCallback(async () => {
    try {
      if (!subgraphName) return null
      const client = getApolloClient()
      const response = await client.query({
        query: SUBGRAPH_HEALTH,
        variables: { subgraphName },
        fetchPolicy: 'no-cache',
      })
      return response.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number
    } catch (err) {
      console.error(err)
      return null
    }
  }, [subgraphName])

  useEffect(() => {
    if (!blockOnLastFetch || !targetBlockNumber || !account || !chainId) return

    if (blockOnLastFetch >= targetBlockNumber) {
      console.log('App is fully in sync')
      return
    }

    const syncer = async () => {
      try {
        const syncedBlockNumber = await fetchSyncedBlock()
        if (syncedBlockNumber < targetBlockNumber) {
          console.log('Subgraph is not in-sync yet')
          return
        }

        console.log('Subgraph is in sync, updating balances...');
        dispatch(fetchEntries({ account, currentChainId: chainId }))
        dispatch(fetchTokens())
      } catch (err) {
        console.error(err)
      }
    }
    const self = setInterval(syncer, 5000)
    return () => clearInterval(self)
  }, [blockOnLastFetch, targetBlockNumber, fetchSyncedBlock, dispatch, account, chainId, blockNumber]) // blockNumber is our trigger

  return null
}
