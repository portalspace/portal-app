import { configureStore } from '@reduxjs/toolkit'

import application from './application/reducer'
import balances from './balances/reducer'
import entries from './entries/reducer'
import images from './images/reducer'
import selected from './selected/reducer'
import tokens from './tokens/reducer'
import transactions from './transactions/reducer'

const store = configureStore({
  reducer: {
    application,
    balances,
    entries,
    images,
    selected,
    transactions,
    tokens,
  },
})

export default store
