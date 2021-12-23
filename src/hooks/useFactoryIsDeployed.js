import { useEffect, useState } from 'react'

import { useWeb3React } from './useWeb3'
import { useNftBridgeContract } from './useContract'
import { isAddress } from '../utils/account'
import { useBlockNumber } from '../state/application/hooks'

export function useFactoryIsDeployed(tokenId, targetChainId) {
  const { account, library } = useWeb3React()
  const [ loading, setLoading ] = useState(true)
  const [ factoryIsDeployed, setIsDeployed ] = useState(false)
  const Contract = useNftBridgeContract(targetChainId)
  const blockNumber = useBlockNumber()
  // Disable loader after first successful fetch considering it fetches every block
  const [ showLoader, setShowLoader ] = useState(true)

  useEffect(() => {
    const fetchIsDeployed = async () => {
      try {
        showLoader && setLoading(true)
        let result = await Contract.tokens(tokenId)
        setIsDeployed(isAddress(result) && result !== '0x0000000000000000000000000000000000000000')
        setShowLoader(false)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setIsDeployed(false)
        setLoading(false)
      }
    }

    if (account && library && Contract && tokenId && targetChainId) {
      fetchIsDeployed()
    } else {
      setIsDeployed(false)
    }
  }, [account, library, Contract, tokenId, targetChainId, blockNumber])

  return { factoryIsDeployed, loading }
}
