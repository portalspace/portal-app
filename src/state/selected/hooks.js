import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useSelectedState = () => {
  return useSelector(state => {
    return state.selected
  })
}
