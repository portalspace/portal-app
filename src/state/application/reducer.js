import { createReducer, nanoid } from '@reduxjs/toolkit'
import {
  setOpenModal,
  updateBlockNumber,
  addPopup,
  removePopup,
  updateChainId
} from './actions'

export const ApplicationModal = {
  WALLET: 'WALLET',
  NETWORK: 'NETWORK',
}

const initialState = {
  chainId: null,
  openModal: false,
  blockNumber: {},
  popupList: [],
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateChainId, (state, { payload }) => {
      const { chainId } = payload
      state.chainId = chainId
    })
    .addCase(updateBlockNumber, (state, { payload }) => {
      const { chainId, blockNumber } = payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(setOpenModal, (state, { payload }) => {
      state.openModal = payload
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 25000 }}) => {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(removePopup, (state, { payload }) => {
      const { key } = payload
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
)
