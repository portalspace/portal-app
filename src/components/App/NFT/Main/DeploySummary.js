import React, { useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { truncateAddress } from '../../../../utils/account'
import { useSelectedState } from '../../../../state/selected/hooks'
import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../../../constants/network'

import { Image } from '../Image'
import { Copy as CopyIcon } from '../../../Icons'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  background: #222A36;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  z-index: 0;
  padding: 20px;
  align-items: center;
  gap: 10px;
`

const Images = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
`

const DetailsWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;

  & > * {
    &:first-child {
      font-size: 20px;
      height: 24px;
      line-height: 24px;
    }
    &:nth-child(2) {
      font-size: 15px;
      color: #6F7077;
      height: 24px;
      line-height: 19px;
      margin-top: 1px;
    }
    &:nth-child(3) {
      font-size: 15px;
      height: 19px;
      line-height: 19px;
      margin-top: 4px;
    }
  }
`

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const DeploySummary = ({ contract, chainId }) => {
  const dispatch = useDispatch()
  const selected = useSelectedState()

  const [name, symbol, isMuon] = useMemo(() => {
    return [
      selected.collection.name,
      selected.collection.symbol,
      selected.collection.isMuon,
    ]
  }, [selected])

  return (
    <Wrapper>
      <DetailsWrapper>
        <div>{name} - {symbol}</div>
        <div>Original chain: {BEAUTIFIED_CHAINS_BY_CHAIN_ID[chainId]}</div>
        <div>
          {truncateAddress(contract)}
          <CopyIcon style={{transform: 'translateY(2px)', marginLeft: '10px'}}/>
        </div>
      </DetailsWrapper>
      <Images>
      {ids.map(nftId => {
        return (
          <Image
            key={nftId}
            contractAddress={contract}
            isMuon={isMuon}
            nftId={nftId}
            alt={`${nftId} image`}
            height={'30px'}
            width={'30px'}
          />
        )
      })}
      </Images>
    </Wrapper>
  )
}
