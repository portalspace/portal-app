import { createAction } from '@reduxjs/toolkit'

export const addBlob = createAction('images/addBlob')
export const enqueue = createAction('images/enqueue')
export const dequeue = createAction('images/dequeue')
export const addURIs = createAction('images/addURIs')
