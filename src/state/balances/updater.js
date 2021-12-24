import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useWeb3React } from '../../hooks/useWeb3'
import { fetchBalances } from './reducer'

export default function Updater() {
  const { account, chainId } = useWeb3React()
  const dispatch = useDispatch()

  // No sanity check: this will reset state if (!account || !chainId)
  useEffect(() => {
    const update = () => dispatch(fetchBalances({ account, chainId }))
    update()
    const self = setInterval(() => update(), 60 * 1000)
    return () => clearInterval(self)
  }, [dispatch, account, chainId])
  return null
}
