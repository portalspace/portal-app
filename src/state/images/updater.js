import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { groupBy } from 'lodash'

import ERC721_ABI from '../../constants/abi/ERC721.json'
import { useMulticallContract } from '../../hooks/useContract'
import { dequeue, addURIs } from './actions'
import { useQueue } from './hooks'

/**
 * This queue-system exists because our app requires multicalls across all the
 * chains simultaneously, and it acts as load balancer for maximum performance.
 * For example, when we're dealing with hundreds of collections and thus
 * thousands of NFTs for an account on a single render, we don't want to
 * instantiate a new MulticallInstance each time, and only add one or two params
 * in the calls mapping. Using the queue, we can map everything to a single
 * instance within the queue's slot. Image (results) are then stored in a global
 * state, so any component can access them.
 */

const QUEUE_SPEED_MS = 2000

export default function Updater() {
  const dispatch = useDispatch()
  const queue = useQueue()
  const [ loading, setLoading ] = useState(false)
  const getMulticallCallback = useMulticallContract()

  useEffect(() => {
    const processQueue = async () => {
      try {
        if (!queue.length) return
        if (loading) return

        const itemsPerChain = groupBy(queue, 'mainChain')
        const MulticallInstances = Object.keys(itemsPerChain).reduce((acc, chainId) => {
          acc[chainId] = getMulticallCallback(chainId) ?? null
          return acc
        }, {})
        const multicallIsNotReady = Object.values(MulticallInstances).includes(null)
        if (multicallIsNotReady) return

        // Prevent a new fetcher
        setLoading(true)

        const promises = Object.entries(itemsPerChain).map(([chainId, arr]) => {
          const callsPerChain = []
          const itemsPerContract = groupBy(arr, 'contractAddress')
          Object.entries(itemsPerContract).forEach(([contractAddress, objs]) => {
            callsPerChain.push({
              reference: contractAddress,
              contractAddress: contractAddress,
              abi: ERC721_ABI,
              calls: objs.map(o => {
                return {
                  reference: o.nftId,
                  methodName: 'tokenURI',
                  methodParameters: [o.nftId]
                } // End of return
              }) // End of calls
            }) // End of callsPerChain.push
          }) // End of forEach
          if (!callsPerChain.length) return null

          // Fetch the tokenURIs
          return MulticallInstances[chainId].call(callsPerChain)
        }).filter(o => o) // End of promises

        // Parse the URIs
        const fulfilled = await Promise.allSettled(promises)
        const result = []

        fulfilled.forEach(({ status, value }) => {
          if (status != 'fulfilled') return
          const { results } = value
          for (const contractAddress in results) {
            results[contractAddress]['callsReturnContext'].forEach(obj => {
              if (!obj.success) return
              result.push({
                contractAddress: contractAddress,
                nftId: obj.reference,
                tokenURI: obj.returnValues[0],
              })
            })
          }
        })

        // Propagate results to app
        dispatch(addURIs(result))

        // Remove current items from queue
        dispatch(dequeue({ items: queue }))
        setLoading(false)

      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    processQueue()
    const self = setInterval(() => processQueue(), QUEUE_SPEED_MS)
    return () => clearInterval(self)
  }, [dispatch, queue, getMulticallCallback, loading])

  return null
}
