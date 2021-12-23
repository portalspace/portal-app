import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { getApolloClient } from '../../apollo/client/bridge'
import { TOKENS } from '../../apollo/queries'
import { SUPPORTED_CHAIN_IDS } from '../../constants/network'

const initialState = {
  status: 'OK',
  data: [],
}

export const fetchTokens = createAsyncThunk(
  'tokens/fetchTokens',
  async () => {
    try {
      const promises = SUPPORTED_CHAIN_IDS.map(async chainId => {
        const client = getApolloClient(chainId)
        if (!client) return []

        const { data } = await client.query({
          query: TOKENS,
          fetchPolicy: 'no-cache',
        })
        return data.tokens.filter(obj => obj.isMain)
      })

      const result = await Promise.all(promises)
      return [].concat.apply([], result) // merge n arrays
    } catch (err) {
      console.log('Unable to fetch tokens from Apollo')
      console.error(err)
      return []
    }
  }
)

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTokens.pending, (state) => {
        state.status = 'LOADING'
        state.data = [ ...state.data ]
      })
      .addCase(fetchTokens.fulfilled, (state, { payload }) => {
        state.status = 'OK'
        state.data = payload
      })
      .addCase(fetchTokens.rejected, (state) => {
        state.status = 'OK' // TODO: check if we need OK or ERROR
        state.data = []
      })
  }
})

export default tokensSlice.reducer
