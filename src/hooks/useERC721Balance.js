import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from './useWeb3'

import { useERC721Contract } from './useContract'
import { useBlockNumber } from '../state/application/hooks'

export const useERC721Balance = (tokenAddress, nftId) => {
  const { account, library } = useWeb3React()
  const [ balance, setBalance ] = useState(true)
  const Contract = useERC721Contract(tokenAddress)
  const blockNumber = useBlockNumber()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        let owner = await Contract.ownerOf(nftId)
        setBalance && setBalance(owner.toLowerCase() == account.toLowerCase())
      } catch (err) {
        console.error(err)
        setBalance && setBalance(false)
      }
    }

    if (account && library && tokenAddress && Contract && nftId) {
      fetchBalance()
    } else {
      setBalance && setBalance(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, library, tokenAddress, nftId, blockNumber])

  return balance
}
