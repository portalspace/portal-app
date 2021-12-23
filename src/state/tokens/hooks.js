import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useTokensState = () => {
  return useSelector(state => {
    return state.tokens
  })
}
