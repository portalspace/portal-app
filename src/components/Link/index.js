import React from 'react'
import styled from 'styled-components'

import { EXPLORER_LINKS_BY_CHAIN_ID } from '../../constants/explorers'

export const ExplorerDataType = {
  TX: 'tx',
  ADDRESS: 'address',
}

const Link = styled.a`
  text-decoration: none;
  color: inherit;

  &:focus,
  &:hover,
  &:active {
    cursor: pointer;
    outline: none;
  }
`

export const ExternalLink = ({
  href ='#',
  target = '_blank',
  rel ='noopener noreferrer',
  children,
}) => {
  return (
    <Link href={href} target={target} rel={rel}>
      {children}
    </Link>
  )
}

export const ExplorerLink = ({ type, chainId, value, children }) => {
  const host = EXPLORER_LINKS_BY_CHAIN_ID[chainId]
  return (
    <ExternalLink href={`${host}/${type}/${value}`}>
      {children}
    </ExternalLink>
  )
}
