import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { findIndex, orderBy } from 'lodash'

import { useWeb3React } from '../../hooks/useWeb3'

export const useEntriesState = () => {
  return useSelector(state => {
    return state.entries
  })
}

export const useDeposits = () => {
  const { chainId } = useWeb3React()
  const { data, status } = useEntriesState()
  return useMemo(() => {
    return {
      status: status,
      data: data.filter(o => o.fromChain == chainId),
    }
  }, [data, status, chainId])
}

export const useClaims = () => {
  const { chainId } = useWeb3React()
  const { data, status } = useEntriesState()
  return useMemo(() => {
    return {
      status: status,
      data: data.filter(o => o.toChain == chainId),
    }
  }, [data, status, chainId])
}
