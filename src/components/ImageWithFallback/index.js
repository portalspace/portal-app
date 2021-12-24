import React, { useState } from 'react'
import Image from 'next/image'

import LoaderGif from '../../assets/images/fallback/loader.gif'
import NotFound from '../../assets/images/fallback/not_found.png'

export const ImageWithFallback = ({ src, alt, width, height, loading = false, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const getProps = () => {
    return {
      alt,
      width,
      height,
      onError: () => setImgSrc(NotFound),
      ...rest,
    }
  }

  return loading ? (
    <Image
      src={LoaderGif}
      {...getProps()}
    />
  ) : (
    <Image
      src={src || NotFound}
      unoptimized={true} // nextjs doesn't support blobs hence this arg
      {...getProps()}
    />
  )
}
