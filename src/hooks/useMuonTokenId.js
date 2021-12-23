import { useEffect, useState } from 'react'

import { useWeb3React } from './useWeb3'
import { useNftBridgeContract } from './useContract'
import { useBlockNumber } from '../state/application/hooks'

export function useMuonTokenId(tokenAddress) {
  const { account, library } = useWeb3React()
  const [ loading, setLoading ] = useState(true)
  const [ tokenId, setTokenId ] = useState(null)
  const Contract = useNftBridgeContract()
  const blockNumber = useBlockNumber()
  // Disable loader after first successful fetch considering it fetches every block
  const [ showLoader, setShowLoader ] = useState(true)

  useEffect(() => {
    const fetchTokenId = async () => {
      try {
        showLoader && setLoading(true)
        let result = await Contract.getTokenId(tokenAddress)
        setTokenId(result.toString())
        setShowLoader(false)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setTokenId(null)
        setLoading(false)
      }
    }

    if (account && library && Contract && tokenAddress) {
      fetchTokenId()
    } else {
      setTokenId(null)
    }

  }, [account, library, Contract, tokenAddress, blockNumber])

  return { tokenId, loading }
}
