import React from 'react'
import { X  } from 'react-feather'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  align-items: center;
  font-size: 12.5px;
  padding: 20px
`

const Close = styled(X)`
  width: 13px;
  height: 13px;
  color: #919191;
  &:hover {
    cursor: pointer;
  }
`

const Message = styled.div`
  display: block;
  font-size: 15px;
  color: ${props => props.success ? '#00E376' : 'red'};
`

export default function MessagePopup({ content, removeThisPopup }) {
  const { success, summary: { message } } = content
  return (
    <Wrapper>
      <Message success={success}>{message}</Message>
      <Close onClick={removeThisPopup} />
    </Wrapper>
  )
}
