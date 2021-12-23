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

export const Copy = ({ toCopy, text }) => {
  const [isCopied, setCopied] = useCopyClipboard()
  return isCopied ? (
    <Wrapper>
      <CheckMark size={'12px'}/>
      Copied
    </Wrapper>
  ) : (
    <Wrapper onClick={() => setCopied(toCopy)} >
      <CopyIcon size={'12px'}/>
      {text}
    </Wrapper>
  )
}
