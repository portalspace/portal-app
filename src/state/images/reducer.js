import { createReducer } from '@reduxjs/toolkit'
import { findIndex } from 'lodash'

import { addBlob, enqueue, dequeue, addURIs } from './actions'

const initialState = {
  blobs: {},
  queue: [],
  uris: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addBlob, (state, { payload: { uri, blob } }) => {
      state.blobs[uri] = blob
    })
    .addCase(enqueue, (state, { payload: { contractAddress, nftId, mainChain } }) => {
      state.queue.push({
        mainChain,
        contractAddress,
        nftId,
      })
    })
    .addCase(dequeue, (state, { payload }) => {
      // If nothing provided: clear entire queue, NOT recommended because
      // queue has multiple processes working with it.
      if (!payload.items) return state.queue = []

      // Remove specific items
      state.queue = state.queue.filter(({ contractAddress, nftId }) => {
        const index = findIndex(payload.items, { contractAddress, nftId })
        return index > -1 ? false : true
      })
    })
    .addCase(addURIs, (state, { payload }) => {
      state.uris = payload.reduce((acc, { contractAddress, nftId, tokenURI }) => {
        acc[`${contractAddress}:${nftId}`] = tokenURI
        return acc
      }, state.uris)
    })
)
