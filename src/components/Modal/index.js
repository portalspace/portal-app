import React from 'react'
import styled from 'styled-components'
import StyledModal from 'styled-react-modal'
import { ChevronLeft } from 'react-feather'

import { Close as CloseIcon } from '../Icons'
import { ChevronLeft as ChevronLeftIcon } from '../Icons'

export const Modal = StyledModal.styled`
  display: flex;
  flex-flow: column nowrap;
  background: #293241;
  box-shadow: inset 0px 0px 1px rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: clamp(200px, 75%, ${props => props.width ?? '420px'});
  border-radius: 10px;
`

export const ModalBackground = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(1px);
  justify-content: center;
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #6D737D;
`

const Text = styled.div`
  font-size: 15px;
`

export const ModalHeader = ({
  title = undefined,
  onClose = undefined,
  onBack = undefined,
} = {}) => {
  return (
    <HeaderWrapper>
      {onBack && <ChevronLeftIcon onClick={onBack} width={15} height={15} />}
      {title && <Text>{title}</Text>}
      <CloseIcon width={15} height={15} onClick={onClose}/>
    </HeaderWrapper>
  )
}
