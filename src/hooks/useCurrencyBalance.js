import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from './useWeb3'

import { useBlockNumber } from '../state/application/hooks'

export const useCurrencyBalance = (tokenAddress) => {
  const { account, library } = useWeb3React()
  const [ balance, setBalance ] = useState(BigNumber.from('0'))
  const blockNumber = useBlockNumber()

  useEffect(() => {
    let mounted = true
    const fetchBalance = async () => {
      try {
        let walletBalance = await library.getBalance(tokenAddress ?? account)
        mounted && setBalance(walletBalance)
      } catch (err) {
        console.error(err)
        mounted && setBalance(BigNumber.from('0'))
      }
    }

    if (account && library) {
      fetchBalance()
    } else {
      mounted && setBalance(BigNumber.from('0'))
    }

    return () => mounted = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, tokenAddress, library, blockNumber])

  return balance
}
