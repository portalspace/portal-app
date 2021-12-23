import React from 'react'
import styled from 'styled-components'

import { useWeb3React } from '../../../../hooks/useWeb3'
import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../../../constants/network'
import { useRpcChangerCallback } from '../../../../hooks/useRpcChangerCallback'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 21px 21px 0 21px;
`

const Item = styled.div`
  flex: 1;
  font-size: 15px;
  line-height: 50px;
  text-align: center;
  align-items: center;
  background: rgba(13, 18, 29, 0.5);
  border: 1px solid #212936;
  color: #7E7E7E;

  &:hover {
    cursor: pointer;
  }

  ${props => props.active && `
    filter: drop-shadow(0px 0px 45px rgba(0, 0, 0, 0.05));
    background: #0D121D;
    border: 2px solid #0064FA;
    color: #EFEFEF;
  `}

  &:first-child {
    border-radius: 10px 0 0 10px;
  }

  &:last-child {
    border-radius: 0 10px 10px 0;
  }
`

export const NetworkBar = () => {
  const { chainId } = useWeb3React()
  const rpcChangerCallback = useRpcChangerCallback()

  return (
    <Wrapper>
      {Object.entries(BEAUTIFIED_CHAINS_BY_CHAIN_ID).map(([id, name], index) => {
        return (
          <Item
            active={id == chainId} // entries maps the id as a string, so use equal value comparison (==)
            onClick={() => rpcChangerCallback(id)}
            key={index}
          >{name}</Item>
        )
      })}
    </Wrapper>
  )
}
