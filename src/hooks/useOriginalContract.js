import { useMemo } from 'react'
import { find } from 'lodash'

import { useWeb3React } from './useWeb3'
import { useTokensState } from '../state/tokens/hooks'
import { useEntriesState } from '../state/entries/hooks'

export function useOriginalContract(contractAddress) {
  const { chainId } = useWeb3React()
  const { data_raw: entries, status: entriesStatus } = useEntriesState() // unfiltered so we can find mainChain
  const { data: tokens, status: tokensStatus } = useTokensState()

  const isLoading = useMemo(() => {
    return entriesStatus !== 'OK' || tokensStatus !== 'OK'
  }, [entriesStatus, tokensStatus])

  const DEFAULT = useMemo(() => {
    return {
      contractAddress,
      mainChain: chainId ?? null
    }
  }, [contractAddress, chainId])

  return useMemo(() => {
    if (!entries || !tokens || isLoading || !chainId) return DEFAULT

    // Each asset that has interacted with the Bridge contract is flagged with the crosschain Muon ID
    const { tokenId } = find(entries, { contractAddress }) || {}
    if (!tokenId) return DEFAULT // TODO: fix this, has to do with received Muon NFTs (gql query $account)

    // Now that we've acquired the tokenId we can simple lookup the original contract
    const foundToken = find(tokens, { tokenId, isMain: true })
    if (!foundToken) {
      console.error('Unable to find entry with tokenId: ', tokenId) // this should NOT be possible
      return DEFAULT
    }

    return {
      contractAddress: foundToken.contractAddress,
      mainChain: parseInt(foundToken.mainChain),
    }
  }, [entries, tokens, isLoading, chainId])
}
