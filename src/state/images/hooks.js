import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useImagesState = () => {
  return useSelector(state => {
    return state.images
  })
}

export const useBlobs = () => {
  const images = useImagesState()
  return images.blobs
}

export const useQueue = () => {
  const images = useImagesState()
  return images.queue
}

export const useTokenURI = (contractAddress, originalContractAddress, nftId) => {
  const { uris } = useImagesState()
  return useMemo(() => {
    return uris[`${contractAddress}:${nftId}`] ?? uris[`${originalContractAddress}:${nftId}`]
  }, [uris, contractAddress, originalContractAddress, nftId])
}
