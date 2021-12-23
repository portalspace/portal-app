import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useWeb3React } from '../../hooks/useWeb3'
import { fetchEntries } from './reducer'

export default function Updater() {
  const { account, chainId } = useWeb3React()
  const dispatch = useDispatch()

  // No sanity check: this will reset state if (!account || !chainId)
  useEffect(() => {
    dispatch(fetchEntries({ account, currentChainId: chainId }))
  }, [dispatch, account, chainId])
  return null
}
