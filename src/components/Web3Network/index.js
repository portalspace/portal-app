import React from 'react'
import styled from 'styled-components'

import { useWeb3React } from '../../hooks/useWeb3'
import { useNetworkModalToggle  } from '../../state/application/hooks'
import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../constants/network'

import { NetworkModal } from '../NetworkModal'
import { NavButton } from '../Button'

const Text = styled.p`
  width: fit-content;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
`

export const Web3Network = () => {
  const { chainId } = useWeb3React()
  const toggleNetworkModal = useNetworkModalToggle()
  if (!chainId) return null

  return (
    <>
      <NavButton onClick={() => toggleNetworkModal()}>
        <Text>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[chainId]}</Text>
      </NavButton>
      <NetworkModal />
    </>
  )
}
