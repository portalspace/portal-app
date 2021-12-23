import { createReducer } from '@reduxjs/toolkit'
import {
  updateCurrentChain,
  updateTargetChain,
  updateCollection,
  updateNftId,
  updateTokenId,
  resetChain,
  resetCollection,
  resetNftId,
  resetAll,
} from './actions'

const initialState = {
  chain: {
    current: null,
    target: null,
  },
  collection: {
    contract: null,
    name: null,
    symbol: null,
    isMuon: false,
  },
  nftId: null,
  tokenId: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateCurrentChain, (state, { payload }) => {
      return {
        ...state,
        chain: {
          ...state.chain,
          current: parseInt(payload),
        }
      }
    })
    .addCase(updateTargetChain, (state, { payload }) => {
      return {
        ...state,
        chain: {
          ...state.chain,
          target: parseInt(payload),
        }
      }
    })
    .addCase(updateCollection, (state, { payload }) => {
      return {
        ...state,
        collection: payload
      }
    })
    .addCase(updateNftId, (state, { payload }) => {
      return {
        ...state,
        nftId: payload
      }
    })
    .addCase(updateTokenId, (state, { payload }) => {
      return {
        ...state,
        tokenId: payload
      }
    })
    .addCase(resetChain, (state) => {
      state.chain = initialState.chain
      return {
        ...state,
        chain: initialState.chain,
      }
    })
    .addCase(resetCollection, (state) => {
      return {
        ...state,
        collection: initialState.collection,
      }
    })
    .addCase(resetNftId, (state) => {
      return {
        ...state,
        nftId: initialState.nftId,
      }
    })
    .addCase(resetAll, (state) => {
      return initialState
    })
)
