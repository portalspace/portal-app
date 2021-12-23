import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import ReactImageFallback from 'react-image-fallback'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

import { isValidHttpUrl, getHostFromUrl } from '../../../utils/http'
import { parseBase64 } from '../../../utils/parser'
import { UrlQueueMapping } from '../../../utils/queue'
import { addBlob, enqueue } from '../../../state/images/actions'
import { useTokenURI, useBlobs } from '../../../state/images/hooks'
import { useOriginalContract } from '../../../hooks/useOriginalContract'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.height ? props.height : '60px'};
  width: ${props => props.width ? props.width : '120px'};
  overflow: hidden;
`

const StyledImage = styled(ReactImageFallback)`
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
`

export const Image = ({ contractAddress, nftId, alt, height, width, ...rest }) => {
  const dispatch = useDispatch()
  const [urlLoaded, setUrlLoaded] = useState(true)
  const [blob, setBlob] = useState(null)
  const [mounted, setMounted] = useState(true)
  const { contractAddress: originalContractAddress, mainChain } = useOriginalContract(contractAddress)
  const uri = useTokenURI(contractAddress, originalContractAddress, nftId)
  const blobs = useBlobs()
  useEffect(() => {return () => setMounted(false)}, [])

  useEffect(() => {
    if (!originalContractAddress || !mainChain || !nftId) return
    dispatch(enqueue({ contractAddress: originalContractAddress, nftId: nftId, mainChain }))
  }, [originalContractAddress, mainChain])

  const parseUri = useCallback(() => {
    if (!uri) return null

    if (isValidHttpUrl(uri)) {
      return { protocol: 'http', link: uri }
    }

    // Check if its a raw ipfs link
    let ipfs = parseBase64(uri)
    let image = ipfs.image

    return image
      ? { protocol: 'ipfs', link: image }
      : null // TODO: solve this
  }, [uri])

  const getImageBlob = useCallback(async () => {
    const { protocol, link } = parseUri() || {}
    if (!protocol || !link) return null

    // Check if we have a cached version of the image
    const cachedBlob = blobs[uri]
    if (cachedBlob) {
      return cachedBlob
    }

    /**
     * IPFS resolves directly via the data:image path.
     * Note: ipfs protocol is considered an alternative to http.
     * In other words, ipfs.io belongs to the https protocol.
     */
    if (protocol === 'ipfs') {
      return link
    }

    const host = getHostFromUrl(link)
    const Queue = UrlQueueMapping[host]
      ? UrlQueueMapping[host]
      : UrlQueueMapping.default

    const imageUrl = await Queue.add(async () => {
      try {
        let res = await fetch(`https://coinlordd-cors-anywhere.herokuapp.com/${link}`)
        let { image } = await res.json()
        return image
      } catch (err) {
        console.error(err)
        return null
      }
    })

    if (!isValidHttpUrl(imageUrl)) return null
    const imageHost = getHostFromUrl(imageUrl)

    const ImageQueue = UrlQueueMapping[imageHost]
      ? UrlQueueMapping[imageHost]
      : UrlQueueMapping.default

    return await ImageQueue.add(async () => {
      try {
        const response = await fetch(`https://coinlordd-cors-anywhere.herokuapp.com/${imageUrl}`)
        const imageBlob = await response.blob()
        const blobUrl = URL.createObjectURL(imageBlob)
        return blobUrl
      } catch (err) {
        console.error(err)
        return null
      }
    })
  }, [parseUri, blobs])

  useEffect(() => {
    const fetcher = async () => {
      setUrlLoaded(false)
      const result = await getImageBlob()

      // Add image to cache
      if (uri && result) {
        dispatch(addBlob({
          uri: uri,
          blob: result
        }))
      }

      if (mounted) {
        setBlob(result)
        setUrlLoaded(true)
      }

    }
    fetcher()
  }, [uri])

  return (
    <Wrapper height={height} width={width} {...rest}>
      {urlLoaded ? (
        <StyledImage
          fallbackImage={'/images/fallback/collection_404.png'}
          initialImage={'/images/fallback/collection_loader.gif'}
          src={blob}
          alt={alt}
        />
      ) : (
        <StyledImage
          fallbackImage={'/images/fallback/collection_loader.gif'}
          src={'/images/fallback/collection_loader.gif'}
        />
      )}
    </Wrapper>
  )
}
