import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'

import { useWeb3React } from '../../../../hooks/useWeb3'
import { useBalances } from '../../../../state/balances/hooks'
import { useSelectedState } from '../../../../state/selected/hooks'
import { updateNftId, resetNftId } from '../../../../state/selected/actions'

import { PHASE_VIEWS } from './index'
import { NetworkBar } from './NetworkBar'
import { ProgressWrapper, ProgressButton } from './ProgressBar'
import { Image } from '../Image'
import { Loader } from '../../../Icons'
import { RowNoWrap, RowBlock } from '../../../Row'
import { ColumnNoWrap } from '../../../Column'

const Container = styled(ColumnNoWrap)`
  height: 100%;
`

const GridWrapper = styled.div`
  flex: 1;
  margin-top: 30px;
`

const Grid = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`

const Cell = styled(RowNoWrap)`
  justify-content: space-between;
  padding: 7.5px 20px;

  &:hover {
    cursor: pointer;
  }

  ${props => !props.active && `
    &:hover {
      background: #3B475B;
      cursor: pointer;
    }
  `}

  ${props => props.active && `
    background: #0D121D;
    box-shadow: 0px 0px 0px 1px #0064FA inset; // prevents padding jumps
  `}
`

const TokenId = styled.div`
  display: flex;
  flex-flow: row wrap;
  font-size: 17.5px;
  overflow: hidden;
  white-space: nowrap;
  & > * {
    text-overflow: ellipsis;
  }
`

export const Collection = ({ setPhaseView }) => {
  const { chainId } = useWeb3React()
  const dispatch = useDispatch()
  const { data: balances, status: balancesStatus } = useBalances()
  const selected = useSelectedState()

  const isLoading = useMemo(() => {
    return balancesStatus !== 'OK'
  }, [balancesStatus])

  const [selectedContract, selectedNftId] = useMemo(() => {
    return [
      selected.collection.contract,
      selected.nftId,
    ]
  }, [selected])

  const collection = useMemo(() => {
    if (!balances.length || isLoading || !selectedContract) return null
    return balances.find(o => o.contractAddress == selectedContract)
  }, [balances, isLoading, selectedContract])

  const onSelect = (nftId) => {
    if (!nftId) {
      return console.error('Arguments are missing when trying to select nft')
    }
    return selectedNftId == nftId
      ? dispatch(resetNftId())
      : dispatch(updateNftId(nftId))
  }

  function renderItems() {
    return (
      <GridWrapper>
        {(isLoading && !collection) ? (
          <RowBlock>
            <Loader size='40px' stroke='black'/>
          </RowBlock>
        ) : !collection ? (
          <RowBlock>
            You don&apos;t have any NFTs in this collection.
          </RowBlock>
        ) : (
          <Grid>
            {collection.owned.map((nftId, index) => {
              const id = parseInt(nftId)
              return (
                <LazyLoad
                  height={37.5} // (row + padding) / nColumns
                  key={index}
                  once
                  overflow
                >
                  <Cell
                    active={selectedNftId === id}
                    onClick={() => onSelect(id)}
                  >
                    <Image
                      contractAddress={collection.contractAddress}
                      isMuon={collection.isMuon}
                      nftId={id}
                      alt={`${id} image`}
                      size={'60px'}
                    />
                    <TokenId>
                      <div>{collection.symbol}&nbsp;</div>
                      <div>#{id}</div>
                    </TokenId>
                  </Cell>
                </LazyLoad>
              )
            })}
          </Grid>
        )}
      </GridWrapper>
    )
  }

  return (
    <Container>
      <NetworkBar />
      {renderItems()}
      <ProgressWrapper style={{marginTop: 'auto'}}>
        <ProgressButton
          active={true}
          onClick={() => {
            dispatch(resetNftId())
            setPhaseView(PHASE_VIEWS.OVERVIEW)
          }}
        >Back</ProgressButton>
        <ProgressButton
          highlight={!!selectedNftId}
          onClick={() => selectedNftId && setPhaseView(PHASE_VIEWS.BRIDGE)}
        >{selectedNftId ? 'Continue' : 'Select your NFT'}</ProgressButton>
      </ProgressWrapper>
    </Container>
  )
}
