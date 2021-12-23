import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { useWeb3React } from '../../hooks/useWeb3'
import { useRpcChangerCallback } from '../../hooks/useRpcChangerCallback'

import { BEAUTIFIED_CHAINS_BY_CHAIN_ID, SUPPORTED_CHAINS_BY_ID, SUPPORTED_CHAIN_IDS } from '../../constants/network'
import { Modal, ModalHeader } from '../../components/Modal'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  gap: 8px;
  padding: 25px 20px;
  overflow-y: auto;
`

const Option = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  background: #222A36;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #EFEFEF;
  font-size: 20px;
  border-radius: 5px;
  outline: none;
  height: 50px;
  align-items: center;
  padding: 12px 20px;

  ${props => props.active && `
    background: #0D121D;
    border: 1px solid #0064FA;
  `}

  &:focus,
  &:hover {
    background: #0D121D;
    cursor: pointer;
  }

  & > * {
    &:first-child {
      border-radius: 3px;
    }
  }
`

export const NetworkModal = () => {
  const { chainId } = useWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()
  const rpcChangerCallback = useRpcChangerCallback()
  if (!chainId) return null

  return (
    <Modal isOpen={networkModalOpen} onBackgroundClick={toggleNetworkModal} onEscapeKeydown={toggleNetworkModal} width={'450px'}>
      <ModalHeader onClose={toggleNetworkModal} title="Select a Network" />
      <Wrapper>
        {SUPPORTED_CHAIN_IDS.map((key, i) => {
          const active = chainId == key
          return (
            <Option
              key={i}
              active={active}
              onClick={() => {
                if (active) return
                toggleNetworkModal()
                rpcChangerCallback(key)
              }}
            >
              <div>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[key]}</div>
              <Image
                src={require(`../../assets/images/network/${SUPPORTED_CHAINS_BY_ID[key]}.jpg`)}
                alt={`${BEAUTIFIED_CHAINS_BY_CHAIN_ID[key]} Network`}
                width="30px"
                height="30px"
              />
            </Option>
          )
        })}
      </Wrapper>
    </Modal>
  )
}
