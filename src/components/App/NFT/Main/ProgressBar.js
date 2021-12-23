import React from 'react'
import styled from 'styled-components'

export const ProgressWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #2B3444;
  border-radius: 0 0 10px 10px;
  height: 60px;
`

export const ProgressButton = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  flex: 1;
  line-height: 60px;
  background: ${props => props.active ? 'transparent' : 'rgba(239, 239, 239, 0.2)'};
  text-align: center;
  align-text: center;
  align-items: center;
  font-size: 20px;
  color: #888C92;

  &:hover {
    cursor: pointer;
    background: linear-gradient(0deg, #3B475B, #3B475B), #0D121D;
  }

  ${props => props.highlight && `
    background: #0064FA;
    color: #FFFFFF;
  `}
`
