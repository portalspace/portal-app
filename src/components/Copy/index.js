import React from 'react'
import styled from 'styled-components'

import { useCopyClipboard } from '../../hooks/useCopyClipboard'
import { Copy as CopyIcon, CheckMark } from '../Icons'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  gap: 5px;
  align-items: center;

  &:hover,
  &:focus {
    cursor: pointer;
  }
`

export const Copy = ({ toCopy, text, placement = 'left' }) => {
  const [isCopied, setCopied] = useCopyClipboard()
  return isCopied ? (
    <Wrapper>
      {placement == 'right' && 'Copied'}
      <CheckMark size={'12px'}/>
      {placement == 'left' && 'Copied'}
    </Wrapper>
  ) : (
    <Wrapper onClick={() => setCopied(toCopy)} >
      {placement == 'right' && text}
      <CopyIcon size={'12px'} style={{transform: 'translateY(-1px)'}}/>
      {placement == 'left' && text}
    </Wrapper>
  )
}
