import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'
import { find } from 'lodash'

import { useWeb3React } from '../../../../hooks/useWeb3'
import { useWalletModalToggle  } from '../../../../state/application/hooks'
import { useBalances } from '../../../../state/balances/hooks'
import { useSelectedState } from '../../../../state/selected/hooks'
import { useEntriesState } from '../../../../state/entries/hooks'
import { useTokensState } from '../../../../state/tokens/hooks'
import { updateCollection, resetCollection } from '../../../../state/selected/actions'

import { PHASE_VIEWS } from './index'
import { NetworkBar } from './NetworkBar'
import { ProgressWrapper, ProgressButton } from './ProgressBar'
import { Image } from '../Image'
import { Loader } from '../../../Icons'
import { RowNoWrap, RowBlock } from '../../../Row'
import { ColumnNoWrap } from '../../../Column'
import { Web3Status } from '../../../Web3Status'

const Container = styled(ColumnNoWrap)`
  height: 100%;
`

const RowWrapper = styled.div`
  flex: 1;
  margin-top: 30px;
  overflow: scroll;
`

const Row = styled(RowNoWrap)`
  justify-content: space-between;
  padding: 7.5px 0;

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

const ImageWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
`

const Label = styled.div`
  height: 14px;
  line-height: 14px;
  font-size: 8px;
  color: #000000;
  background: gray;
  border-radius: 2px;
  padding: 0 3px;
`

const Details = styled(ColumnNoWrap)`
  justify-content: center;
  align-items: flex-end;
  margin-right: 30px;

  & > * {
    &:first-child {
      font-size: 17.5px;
    }
    &:nth-child(2) {
      font-size: 15px;
      color: #B5B5B5;
    }
  }
`

export const Overview = ({ setPhaseView }) => {
  const { account, chainId } = useWeb3React()
  const dispatch = useDispatch()
  const { data: balances, status: balancesStatus } = useBalances()
  const selected = useSelectedState()
  const toggleWalletModal = useWalletModalToggle()

  const [isConnected, isLoading, isError] = useMemo(() => {
    return [
      account && chainId,
      balancesStatus == 'LOADING',
      balancesStatus == 'ERROR',
    ]
  }, [account, chainId, balancesStatus])

  const selectedContract = useMemo(() => {
    return selected.collection.contract
  }, [selected])

  const onSelect = (contract, name, symbol, isMuon = false) => {
    if (!contract || !name || !symbol) {
      return console.error('Arguments are missing when trying to select contract')
    }
    return selectedContract == contract
      ? dispatch(resetCollection())
      : dispatch(updateCollection({ contract, name, symbol, isMuon }))
  }

  function renderCollections() {
    return (
      !isConnected ? (
        <RowBlock>
          Please connect your wallet.
        </RowBlock>
      ) : isError ? (
        <RowBlock>
          The Graph hosted network which provides the data for our app is currently offline. Please check again later.
        </RowBlock>
      ) : (isLoading && !balances.length) ? (
        <RowBlock>
          <Loader size='40px' stroke='black'/>
        </RowBlock>
      ) : !balances.length ? (
        <RowBlock>
          You don&apos;t have any ERC721 NFTs.
        </RowBlock>
      ) : (
        <RowWrapper>
          {balances.map((collection, index) => {
            const { contractAddress, isMuon, name, symbol, owned } = collection
            const amount = owned.length
            return (
              <LazyLoad
                height={75} // row + padding
                overflow={true}
                key={index}
              >
                <Row
                  active={selectedContract === contractAddress}
                  onClick={() => onSelect(contractAddress, name, symbol, isMuon)}
                >
                  <ImageWrapper>
                    <Image
                      contractAddress={contractAddress}
                      isMuon={isMuon}
                      nftId={parseInt(owned[0])}
                      alt={`${name} collection`}
                      height={'60px'}
                      width={'120px'} // center with 30 padding
                    />
                    {isMuon && <Label>Muon Asset</Label>}
                  </ImageWrapper>
                  <Details>
                    <div>{name}</div>
                    <div>{amount} {amount === 1 ? 'Item' : 'Items'}</div>
                  </Details>
                </Row>
              </LazyLoad>
            )
          })}
        </RowWrapper>
      )
    )
  }

  return (
    <Container>
      <NetworkBar />
      {renderCollections()}
      <ProgressWrapper style={{marginTop: 'auto'}}>
        {isConnected ? (
          <ProgressButton
            highlight={!!selectedContract}
            onClick={() => selectedContract && setPhaseView(PHASE_VIEWS.COLLECTION)}
          >{selectedContract ? 'Continue' : 'Select a collection'}</ProgressButton>
        ) : (
          <ProgressButton highlight={true} onClick={toggleWalletModal}>
            Connect Wallet
          </ProgressButton>
        )}
      </ProgressWrapper>
    </Container>
  )
}
