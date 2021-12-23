import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { groupBy, values, findIndex } from 'lodash'

import { getApolloClient } from '../../apollo/client/balances'
import { BALANCES } from '../../apollo/queries'
import { isMuon } from '../../utils/muon'
import { removeAsset } from './actions'

const initialState = {
  status: 'OK',
  blockNumber: null,
  data: {},
}

export const fetchBalances = createAsyncThunk(
  'balances/fetchBalances',
  async ({ account, chainId }) => {
    // Catch this by `rejected`
    if (!account || !chainId) throw new Error('No account or chainId present')
    try {
      const client = getApolloClient(chainId)
      if (!client) return []

      const { data } = await client.query({
        query: BALANCES,
        variables: { account: account.toLowerCase() }, // non-lowercase'd queries do NOT work
        fetchPolicy: 'no-cache',
      })

      return {
        blockNumber: data._meta.block.number,
        data: data.tokens
      }
    } catch (error) {
      console.log('Unable to fetch balances from Apollo')
      console.error(err)
      return {
        blockNumber: null,
        data: []
      }
    }
  }
)

const balancesSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {
    removeAsset(state, { payload: { contractAddress, nftId }}) {
      console.log('Removing from balances:', contractAddress, nftId)
      return {
        ...state,
        data: {
          ...state.data,
          [contractAddress]: {
            ...state.data[contractAddress],
            owned: state.data[contractAddress]['owned'].filter(id => id != nftId)
          }
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBalances.pending, (state) => {
        return {
          ...state,
          status: 'LOADING'
        }
      })
      .addCase(fetchBalances.fulfilled, (state, { payload: { blockNumber, data } }) => {
        state.status = 'OK'
        state.blockNumber = blockNumber

        const groupedTokens = groupBy(data, 'registry.id')
        state.data = Object.entries(groupedTokens).reduce((acc, [contractAddress, holdings]) => {
          if (!holdings.length) return acc
          const { name, symbol, supportsMetadata } = holdings[0]['registry']
          acc[contractAddress] = {
            contractAddress,
            name,
            symbol,
            supportsMetadata,
            isMuon: isMuon(symbol),
            owned: holdings.map(o => parseInt(o.identifier)),
          }
          return acc
        }, {})
      })
      .addCase(fetchBalances.rejected, (state) => {
        return {
          ...initialState,
          status: 'ERROR',
        }
      })
  }
})

export default balancesSlice.reducer
