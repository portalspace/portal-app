import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { groupBy, findIndex, maxBy, orderBy } from 'lodash'

import { getApolloClient } from '../../apollo/client/bridge'
import { ENTRIES } from '../../apollo/queries'
import { SUPPORTED_CHAIN_IDS } from '../../constants/network'
import { removeEntry } from './actions'

const initialState = {
  status: 'OK',
  blockNumber: null,
  data: [],
  data_raw: [], // unfiltered/unmerged
}

const DEFAULT_RETURN = {
  blockNumber: null,
  data: [],
}

export const fetchEntries = createAsyncThunk(
  'entries/fetchEntries',
  async ({ account, currentChainId }) => {
    if (!account || !currentChainId) {
      console.info('No account or currentChainId present')
      return DEFAULT_RETURN
    }
    try {
      const promises = SUPPORTED_CHAIN_IDS.map(async chainId => {
        const client = getApolloClient(chainId)
        if (!client) return DEFAULT_RETURN

        const { data } = await client.query({
          query: ENTRIES,
          variables: { account },
          fetchPolicy: 'no-cache',
        })
        return {
          blockNumber: chainId == currentChainId ? data._meta.block.number : null,
          data: data.entries.filter(obj => SUPPORTED_CHAIN_IDS.includes(parseInt(obj.toChain)))
        }
      })
      const result = await Promise.all(promises)
      return {
        blockNumber: result.map(o => o.blockNumber).filter(num => num)[0],
        data: [].concat.apply([], result.map(o => o.data)) // merge n arrays
      }
    } catch (err) {
      console.log('Unable to fetch entries from Apollo')
      console.error(err)
      return DEFAULT_RETURN
    }
  }
)

const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    removeEntry(state, { payload: { tokenId, nftId }}) {
      console.log('Removing from entries:', tokenId, nftId);
      const id = `${tokenId}:${nftId}`
      const data = {...state.data}[id]
      const latestObj = maxBy(data, 'timestamp')
      const index = data.indexOf(latestObj)
      state.data[id][index].claimed = true
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        return {
          ...state,
          status: 'LOADING'
        }
      })
      .addCase(fetchEntries.fulfilled, (state, { payload: { blockNumber, data } }) => {
        state.status = 'OK'
        state.blockNumber = blockNumber
        state.data_raw = data

        // We assume `data` is a bundle of all entries across all chains.
        const entriesGroupedById = groupBy(data, 'id')
        state.data = Object.entries(entriesGroupedById).reduce((acc, [id, arr]) => {
          /**
           * If one-of-n is claimed the entire collection can be ignored.
           * Reason: when claiming() the entry will return claimed=true
           * and when re-bridging said state will reset to false.
           */
          const claimedIndex = findIndex(arr, 'claimed')
          if (claimedIndex !== -1) return acc

          /**
           * If length is 1 then that means it's resting in the initial bridge
           * contract e.g. (chainA physically present, chainB ready to be minted).
           *
           * If higher length the asset must've been bridged and a third chain
           * is introduced (not claimed). Filter by timestamp to find the latest sender.
           * orderBy is only needed for length > 1 (but we do it anyway)
           */
          acc.push(orderBy(arr, ['timestamp'], ['desc'])[0])
          return acc
        }, [])
      })
      .addCase(fetchEntries.rejected, (state) => {
        return {
          ...initialState,
          status: 'ERROR',
        }
      })
  }
})

export default entriesSlice.reducer
