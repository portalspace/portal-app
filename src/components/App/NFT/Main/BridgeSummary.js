import React, { useMemo } from 'react'
import styled from 'styled-components'

import { truncateAddress } from '../../../../utils/account'
import { useSelectedState } from '../../../../state/selected/hooks'

import { Image } from '../Image'
import { Copy as CopyIcon } from '../../../Icons'
import { Copy } from '../../../Copy'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding: 20px;
  background: #222A36;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  z-index: 0;
  & > * {
    &:first-child {
      margin-right: 50px;
    }
  }
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

export const BridgeSummary = () => {
  const selected = useSelectedState()
  const [contract, name, symbol, isMuon, nftId] = useMemo(() => {
    return [
      selected.collection.contract,
      selected.collection.name,
      selected.collection.symbol,
      selected.collection.isMuon,
      selected.nftId,
    ]
  }, [selected])

  return (
    <Wrapper>
      <Image
        contractAddress={contract}
        isMuon={isMuon}
        nftId={nftId}
        alt={`${nftId} image`}
        height={'90px'}
        width={'90px'}
      />
      <DetailsWrapper>
        <div>{symbol}#{nftId}</div>
        <div>{name}</div>
        <div>
          <Copy toCopy={contract} text={truncateAddress(contract)} placement='right'/>
        </div>
      </DetailsWrapper>
    </Wrapper>
  )
}
