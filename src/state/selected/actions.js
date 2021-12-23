import { createAction } from '@reduxjs/toolkit'

export const updateCurrentChain = createAction('selected/updateCurrentChain')
export const updateTargetChain = createAction('selected/updateTargetChain')
export const updateCollection = createAction('selected/updateCollection')
export const updateNftId = createAction('selected/updateNftId')
export const updateTokenId = createAction('selected/updateTokenId')

export const resetChain = createAction('selected/resetChain')
export const resetCollection = createAction('selected/resetCollection')
export const resetNftId = createAction('selected/resetNftId')
export const resetAll = createAction('selected/resetAll')
