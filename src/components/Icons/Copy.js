import React from 'react'

export default function Copy ({ size = '12px', ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M11.9856 3.02158C11.9856 2.92086 11.9424 2.82014 11.8705 2.7482L9.2518 0.115108C9.17986 0.0431655 9.07914 0 8.97842 0H3.84173C3.32374 0 2.89209 0.431655 2.89209 0.94964V2.89209H0.94964C0.431655 2.89209 0 3.30935 0 3.84173V12.7338C0 13.2518 0.417266 13.6835 0.94964 13.6835H8.15827C8.67626 13.6835 9.10791 13.2662 9.10791 12.7338V10.7914H11.0504C11.5683 10.7914 12 10.3597 12 9.84173L11.9856 3.02158ZM9.36691 1.33813L10.6475 2.61871H9.36691V1.33813ZM8.15827 12.8777H0.94964C0.863309 12.8777 0.791367 12.8058 0.791367 12.7194V3.82734C0.791367 3.74101 0.863309 3.66907 0.94964 3.66907H5.69784V5.89928C5.69784 6.11511 5.8705 6.28777 6.08633 6.28777H8.31655V12.7194C8.31655 12.8058 8.2446 12.8777 8.15827 12.8777ZM6.48921 5.4964V4.21583L7.76978 5.4964H6.48921ZM11.0504 10H9.10791V5.89928C9.10791 5.79856 9.06475 5.69784 8.99281 5.6259L6.3741 2.99281C6.30216 2.92086 6.20144 2.8777 6.10072 2.8777H3.68345V0.94964C3.68345 0.86331 3.7554 0.791367 3.84173 0.791367H8.58993V3.02158C8.58993 3.23741 8.76259 3.41007 8.97842 3.41007H11.2086V9.84173C11.2086 9.92806 11.1367 10 11.0504 10Z" fill="#EFEFEF" fillOpacity="0.5"/>
    </svg>
  )
}
