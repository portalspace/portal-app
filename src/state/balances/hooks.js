import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { values } from 'lodash'

export const useBalancesState = () => {
  return useSelector(state => {
    return state.balances
  })
}

export const useBalances = () => {
  const { data, status } = useBalancesState()
  return useMemo(() => {
    return {
      status,
      data: Object.values(data)
    }
  }, [data, status])
}
