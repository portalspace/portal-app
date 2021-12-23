import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from './useWeb3'

import { useERC721Contract } from './useContract'
import { useBlockNumber } from '../state/application/hooks'

export function useERC721Allowance(tokenAddress, spenderAddress) {
  const { account, library } = useWeb3React()
  const [ allowance, setAllowance ] = useState(BigNumber.from('0'))
  const Contract = useERC721Contract(tokenAddress)
  const blockNumber = useBlockNumber()

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        const result = await Contract.isApprovedForAll(account, spenderAddress)
        setAllowance && setAllowance(result)
      } catch (err) {
        console.error(err)
        setAllowance && setAllowance(BigNumber.from('0'))
      }
    }

    if (account && library && Contract && spenderAddress) {
      fetchAllowance()
    } else {
      setAllowance && setAllowance(BigNumber.from('0'))
    }
  }, [account, library, tokenAddress, spenderAddress, Contract, blockNumber])

  return allowance
}
