import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'

import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../../../constants/network'
import { useRpcChangerCallback } from '../../../../hooks/useRpcChangerCallback'
import { useDeposits } from '../../../../state/entries/hooks'

import { AutoRow } from '../../../Row'
import { PrimaryButton } from '../../../Button'
import { Image } from '../Image'
import { Loader } from '../../../Icons'
import { Card } from '../../../Card'
import { SectionTitle } from '../../../Title'

const Container = styled(Card)`
  margin-top: 17px;
  min-height: 50px;
  max-height: 300px;
  overflow-y: scroll;
  width: 100%;
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 20px 0;
  gap: 13px;
`

const Row = styled(AutoRow)`
  justify-content: flex-start;
  padding-right: 20px;
`

const Name = styled.div`
  margin-right: auto;
  text-overflow: ellipsis;
  font-size: 15px;
`

const EmptyWrapper = styled(AutoRow)`
  justify-content: center;
  margin: auto 0;
  font-size: 13px;
`

export const Deposits = () => {
  const { data: deposits, status: depositsStatus } = useDeposits()
  const rpcChangerCallback = useRpcChangerCallback()

  const [isLoading, isError] = useMemo(() => {
    return [
      depositsStatus == 'LOADING',
      depositsStatus == 'ERROR',
    ]
  }, [depositsStatus])

  return (
    <>
      <SectionTitle>Your Deposits {isLoading && <Loader size='12px'/>}</SectionTitle>
      <Container>
        {(isLoading && !deposits.length) ? (
          <EmptyWrapper>
            <Loader size='25px'/>
          </EmptyWrapper>
        ) : !deposits.length ? (
          <EmptyWrapper>You haven't deposited any NFTs for bridging, yet.</EmptyWrapper>
        ) : (
          <Wrapper>
            {deposits.map((entry, index) => {
              const { contractAddress, nftId, isMuon, fromChain, toChain, tokenId, name, txId } = entry
              return (
                <Row key={index}>
                  <Image
                    contractAddress={contractAddress}
                    isMuon={isMuon}
                    nftId={nftId}
                    alt={`${nftId} image`}
                    height={'30px'}
                    width={'70px'}
                  />
                  <Name>#{nftId} {name}</Name>
                  <PrimaryButton onClick={() => rpcChangerCallback(toChain)} style={{marginLeft: 'auto'}}>
                    Switch to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[toChain]}
                  </PrimaryButton>
                </Row>
              )
            })}
          </Wrapper>
        )}
      </Container>
    </>
  )
}
